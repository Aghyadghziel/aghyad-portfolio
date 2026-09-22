'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * First-party analytics beacon. Cookieless: a random id in localStorage identifies the
 * browser, a sessionStorage id (renewed after 30 minutes idle) identifies the visit.
 * Nothing personal is collected; the server adds location from the request itself.
 */

const SESSION_IDLE_MS = 30 * 60 * 1000;
const PING_MS = 30_000;

const rid = () => (crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '');

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function ids() {
  const local = store('local');
  const session = store('session');
  let vid = local?.getItem('ag_vid');
  if (!vid) {
    vid = rid();
    local?.setItem('ag_vid', vid);
  }
  const last = Number(session?.getItem('ag_last') ?? 0);
  let sid = session?.getItem('ag_sid');
  let fresh = false;
  if (!sid || Date.now() - last > SESSION_IDLE_MS) {
    sid = rid();
    fresh = true;
    session?.setItem('ag_sid', sid);
    session?.setItem('ag_entry', location.pathname);
  }
  session?.setItem('ag_last', String(Date.now()));
  return { vid, sid, fresh };
}

function send(payload: Record<string, unknown>) {
  const { vid, sid } = ids();
  const body = JSON.stringify({ ...payload, vid, sid, path: location.pathname });
  if (navigator.sendBeacon?.(`/api/t`, new Blob([body], { type: 'text/plain' }))) return;
  fetch('/api/t', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}

export function track(name: string, props?: Record<string, string | number>) {
  send({ type: 'event', name, props });
}

const CLICK_PARAMS: [string, string][] = [
  ['gclid', 'google'],
  ['gbraid', 'google'],
  ['wbraid', 'google'],
  ['fbclid', 'meta'],
  ['ttclid', 'tiktok'],
  ['li_fat_id', 'linkedin'],
  ['msclkid', 'microsoft'],
  ['ScCid', 'snapchat'],
  ['twclid', 'x'],
];

const SECTION_IDS = ['about', 'experience', 'projects', 'stack', 'contact'];

export function Tracker() {
  const pathname = usePathname();
  const seen = useRef(new Set<string>());

  // Page view (and a fresh visit's referrer + campaign tags).
  useEffect(() => {
    const { fresh } = ids();
    const params = new URLSearchParams(location.search);
    const external = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : undefined;
    send({
      type: 'pageview',
      referrer: fresh ? external : undefined,
      utm: fresh
        ? {
            source: params.get('utm_source') ?? undefined,
            medium: params.get('utm_medium') ?? undefined,
            campaign: params.get('utm_campaign') ?? undefined,
            term: params.get('utm_term') ?? undefined,
            content: params.get('utm_content') ?? undefined,
          }
        : undefined,
      // Which ad platform sent them, from the click id on the landing URL. The id itself is not sent.
      clickId: fresh ? CLICK_PARAMS.find(([param]) => params.has(param))?.[1] : undefined,
      screen: `${screen.width}x${screen.height}`,
      language: navigator.language,
      locale: document.documentElement.lang,
    });
    seen.current = new Set();
  }, [pathname]);

  // Sections actually seen + scroll depth, once per page view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && !seen.current.has(`s:${id}`)) {
            seen.current.add(`s:${id}`);
            track('section_view', { section: id });
          }
        }
      },
      { threshold: 0.35 },
    );
    const timer = window.setTimeout(() => SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); }), 800);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const pct = (scrollY / max) * 100;
      for (const depth of [25, 50, 75, 100]) {
        if (pct >= depth - 1 && !seen.current.has(`d:${depth}`)) {
          seen.current.add(`d:${depth}`);
          track('scroll', { depth });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  // Outbound + key clicks, captured once at the document level.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const label = (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 60);
      if (href.startsWith('mailto:')) track('email_click', { label });
      else if (href.includes('linkedin.com')) track('linkedin_click');
      else if (href.includes('github.com')) track('github_click');
      else if (href.includes('wa.me')) track('whatsapp_click', { label });
      else if (href.includes('instagram.com')) track('instagram_click');
      else if (/\.pdf($|\?)/.test(href) || href.includes('/cv')) track('cv_download', { label });
      else if (/\/work\/[^/#?]+/.test(href)) track('project_open', { project: href.split('/work/')[1]?.split(/[?#]/)[0] ?? '' });
      else if (/\/blog\/[^/#?]+/.test(href)) track('post_open', { post: href.split('/blog/')[1]?.split(/[?#]/)[0] ?? '' });
      else if (href.endsWith('#contact')) track('cta_click', { label });
      else if (/^https?:\/\//.test(href) && !href.includes(location.host)) track('outbound_click', { label });
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string; props?: Record<string, string | number> }>).detail;
      if (detail?.name) track(detail.name, detail.props);
    };
    document.addEventListener('click', onClick, { capture: true });
    window.addEventListener('aghyad:track', onCustom);
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      window.removeEventListener('aghyad:track', onCustom);
    };
  }, []);

  // Time on site: light pings while the tab is visible, and one when it's hidden.
  useEffect(() => {
    let count = 0;
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && count++ < 60) send({ type: 'ping' });
    }, PING_MS);
    const onHide = () => {
      if (document.visibilityState === 'hidden') send({ type: 'ping' });
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);

  return null;
}
