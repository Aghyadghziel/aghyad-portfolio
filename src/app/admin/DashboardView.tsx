"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dashboard, RangeKey } from "@/lib/server/analytics";
import { markVisitorAction, revokeOthersAction, revokeSessionAction, signOutAction, updateMessageAction } from "./actions";
import styles from "./admin.module.scss";

type Row = Record<string, any>;
type Props = {
  data: Dashboard;
  ranges: { key: RangeKey; label: string }[];
  me: { email: string; sessionId: string };
  messages: Row[];
};

const TABS = ["Overview", "People", "Visits", "Pages", "Messages", "Security"] as const;
type Tab = (typeof TABS)[number];

const nf = new Intl.NumberFormat("en");
const dt = (value: unknown, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }) =>
  value ? new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "Asia/Riyadh" }).format(new Date(value as string)) : "—";

function duration(seconds: number) {
  const s = Math.max(0, Math.round(seconds || 0));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** Change against the previous period of the same length, or null when there is nothing to compare to. */
function delta(now: number, before: number) {
  if (!before) return null;
  const change = ((now - before) / before) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(0)}% vs previous`;
}

/** Area chart drawn as inline SVG: no chart library, so the admin bundle stays small. */
function Chart({ series, bucket }: { series: Row[]; bucket: string }) {
  const points = series.map((r) => Number(r.visitors) || 0);
  const max = Math.max(1, ...points);
  const w = 1000;
  const h = 220;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const coords = points.map((v, i) => [i * step, h - (v / max) * (h - 20)] as const);
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const label = (r: Row) =>
    bucket === "hour" ? dt(r.t, { hour: "2-digit", minute: "2-digit" }) : dt(r.t, { day: "2-digit", month: "short" });

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Visitors over time">
        <path d={area} className={styles.chartArea} />
        <path d={line} className={styles.chartLine} />
      </svg>
      <div className={styles.chartAxis}>
        <span>{series.length ? label(series[0]) : ""}</span>
        <span>peak {nf.format(max)}</span>
        <span>{series.length ? label(series[series.length - 1]) : ""}</span>
      </div>
    </div>
  );
}

function Bars({ title, rows, empty = "Nothing yet" }: { title: string; rows: Row[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r.visitors ?? r.sessions ?? r.count ?? 0)));
  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      {rows.length === 0 ? (
        <p className={styles.mute}>{empty}</p>
      ) : (
        <ul className={styles.bars}>
          {rows.map((r, i) => {
            const value = Number(r.visitors ?? r.sessions ?? r.count ?? 0);
            return (
              <li key={`${r.label ?? r.name ?? r.path}-${i}`}>
                <span className={styles.barFill} style={{ width: `${(value / max) * 100}%` }} />
                <span className={styles.barLabel}>{String(r.label ?? r.name ?? r.path ?? "—")}</span>
                <span className={styles.barValue}>{nf.format(value)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Everything known about one browser, loaded on demand. */
function VisitorDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const [profile, setProfile] = useState<Row | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setProfile(null);
    setFailed(false);
    fetch(`/api/admin/visitor?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json) => live && setProfile(json.profile))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [id]);

  const sessions = (profile?.sessions ?? []) as Row[];
  const events = (profile?.events ?? []) as Row[];
  const messages = (profile?.messages ?? []) as Row[];

  return (
    <div className={styles.drawerBackdrop} onClick={onClose} role="presentation">
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.drawerHead}>
          <div>
            <p className={styles.eyebrow}>Visitor</p>
            <h2 className={styles.drawerTitle}>#{profile?.visitorNo ?? "…"}</h2>
            <p className={styles.faint}>{id}</p>
          </div>
          <div className={styles.rowActions}>
            <form action={markVisitorAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="own" value="1" />
              <button className={styles.ghostButton}>This is me</button>
            </form>
            <form action={markVisitorAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="own" value="0" />
              <button className={styles.ghostButton}>Not me</button>
            </form>
            <button className={styles.ghostButton} onClick={onClose}>
              Close
            </button>
          </div>
        </header>

        {failed && <p className={styles.error}>Could not load this visitor.</p>}
        {!profile && !failed && <p className={styles.mute}>Loading…</p>}

        {profile && (
          <>
            {messages.length > 0 && (
              <section className={styles.drawerSection}>
                <h3 className={styles.cardTitle}>Messages</h3>
                {messages.map((m) => (
                  <article key={String(m.id)} className={styles.messageCard}>
                    <p className={styles.messageMeta}>
                      {dt(m.created_at)} · {String(m.name)} · {String(m.email)}
                    </p>
                    <p>{String(m.message)}</p>
                  </article>
                ))}
              </section>
            )}

            <section className={styles.drawerSection}>
              <h3 className={styles.cardTitle}>Visits ({sessions.length})</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Source</th>
                      <th>Entry → exit</th>
                      <th>Views</th>
                      <th>Time</th>
                      <th>Where</th>
                      <th>Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={String(s.id)}>
                        <td>{dt(s.started_at)}</td>
                        <td>{String(s.source ?? "—")}</td>
                        <td className={styles.path}>
                          {String(s.entry_path)} → {String(s.exit_path)}
                        </td>
                        <td>{nf.format(Number(s.pageviews))}</td>
                        <td>{duration(Number(s.duration))}</td>
                        <td>{[s.city, s.country].filter(Boolean).join(", ") || "—"}</td>
                        <td>{`${s.browser} · ${s.os} · ${s.device}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.drawerSection}>
              <h3 className={styles.cardTitle}>Journey ({events.length} steps)</h3>
              <ol className={styles.journey}>
                {events.map((e, i) => (
                  <li key={i}>
                    <span className={styles.faint}>{dt(e.ts, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                    <span className={styles.badge}>{String(e.type)}</span>
                    <span>{e.type === "pageview" ? String(e.path) : `${e.name} ${e.props ? JSON.stringify(e.props) : ""}`}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </aside>
    </div>
  );
}

export function DashboardView({ data, ranges, me, messages }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("Overview");
  const [visitor, setVisitor] = useState<string | null>(null);

  // Live numbers age fast: refresh the server data while the tab is open.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 60_000);
    return () => window.clearInterval(id);
  }, [router]);

  const now = data.kpis.current as Row;
  const before = data.kpis.previous as Row;
  const active = data.activeUsers as Row;
  const kpis = useMemo(
    () => [
      { label: "Visitors", value: nf.format(Number(now.visitors)), change: delta(Number(now.visitors), Number(before.visitors)) },
      { label: "Visits", value: nf.format(Number(now.sessions)), change: delta(Number(now.sessions), Number(before.sessions)) },
      { label: "Page views", value: nf.format(Number(now.pageviews)), change: delta(Number(now.pageviews), Number(before.pageviews)) },
      { label: "Avg. time", value: duration(Number(now.avg_duration)), change: delta(Number(now.avg_duration), Number(before.avg_duration)) },
      { label: "Bounce", value: `${Math.round(Number(now.bounce_rate) * 100)}%`, change: delta(Number(now.bounce_rate), Number(before.bounce_rate)) },
      { label: "New people", value: nf.format(Number(now.new_visitors)), change: delta(Number(now.new_visitors), Number(before.new_visitors)) },
    ],
    [now, before],
  );

  const setRange = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("range", key);
    router.push(`/admin?${next.toString()}`);
  };

  const b = data.breakdowns;
  const peakMinute = Math.max(1, ...(data.activeMinutes as Row[]).map((m) => Number(m.users)));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AGHYAD · ADMIN</p>
          <h1 className={styles.title}>Site analytics</h1>
          <p className={styles.faint}>Signed in as {me.email}</p>
        </div>
        <div className={styles.headerActions}>
          <select className={styles.select} value={data.range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
            {ranges.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          <a className={styles.ghostButton} href={`/api/admin/export?range=${data.range}`}>
            Export CSV
          </a>
          <form action={signOutAction}>
            <button className={styles.ghostButton}>Sign out</button>
          </form>
        </div>
      </header>

      <section className={styles.live}>
        <div>
          <p className={styles.eyebrow}>Right now</p>
          <p className={styles.liveNumber}>{nf.format(Number(active.now_5m))}</p>
          <p className={styles.faint}>
            {nf.format(Number(active.last_30m))} in 30 min · {nf.format(Number(active.today))} today
          </p>
        </div>
        <div className={styles.spark} aria-hidden="true">
          {(data.activeMinutes as Row[]).map((m, i) => (
            <span
              key={i}
              data-empty={Number(m.users) === 0}
              style={{ height: `${(Number(m.users) / peakMinute) * 100}%` }}
              title={`${m.t} · ${m.users}`}
            />
          ))}
        </div>
      </section>

      <nav className={styles.tabs}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={t === tab ? styles.tabOn : styles.tab}>
            {t}
            {t === "Messages" && messages.length > 0 ? ` (${messages.length})` : ""}
          </button>
        ))}
      </nav>

      {tab === "Overview" && (
        <>
          <section className={styles.kpis}>
            {kpis.map((k) => (
              <article key={k.label} className={styles.kpi}>
                <p className={styles.faint}>{k.label}</p>
                <p className={styles.kpiValue}>{k.value}</p>
                <p className={styles.kpiChange}>{k.change ?? "no earlier data"}</p>
              </article>
            ))}
          </section>

          <Chart series={data.series as Row[]} bucket={data.bucket} />

          <section className={styles.grid}>
            <Bars title="Sources" rows={b.source} />
            <Bars title="Referrers" rows={b.referrer} />
            <Bars title="Countries" rows={b.country} />
            <Bars title="Cities" rows={b.city} />
            <Bars title="Devices" rows={b.device} />
            <Bars title="Browsers" rows={b.browser} />
            <Bars title="Operating systems" rows={b.os} />
            <Bars title="Screens" rows={b.screen} />
            <Bars title="Languages" rows={b.language} />
            <Bars title="Campaigns" rows={b.campaign} empty="No campaign tags used" />
            <Bars title="Actions" rows={data.events as Row[]} empty="No interactions recorded" />
            <Bars title="Scroll depth" rows={(data.scroll as Row[]).map((r) => ({ label: `${r.depth}%`, sessions: r.sessions }))} />
          </section>
        </>
      )}

      {tab === "People" && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>People ({(data.people as Row[]).length})</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Last seen</th>
                  <th>First seen</th>
                  <th>Visits</th>
                  <th>Views</th>
                  <th>Time</th>
                  <th>First source</th>
                  <th>First page</th>
                  <th>Where</th>
                  <th>Device</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data.people as Row[]).map((p) => (
                  <tr key={String(p.visitor_id)} onClick={() => setVisitor(String(p.visitor_id))} className={styles.clickable}>
                    <td>#{String(p.visitor_no)}</td>
                    <td>{dt(p.last_seen)}</td>
                    <td>{dt(p.first_seen, { dateStyle: "medium" })}</td>
                    <td>{nf.format(Number(p.visits))}</td>
                    <td>{nf.format(Number(p.pageviews))}</td>
                    <td>{duration(Number(p.seconds))}</td>
                    <td>{String(p.first_source ?? "—")}</td>
                    <td className={styles.path}>{String(p.first_page ?? "—")}</td>
                    <td>{[p.city, p.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{`${p.browser} · ${p.os}`}</td>
                    <td>{(p.actions as string[])?.join(", ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "Visits" && (
        <>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Live in the last 5 minutes</h3>
            {(data.realtime.sessions as Row[]).length === 0 ? (
              <p className={styles.mute}>Nobody on the site right now.</p>
            ) : (
              <ul className={styles.liveList}>
                {(data.realtime.sessions as Row[]).map((s, i) => (
                  <li key={i} onClick={() => setVisitor(String(s.visitor_id))} className={styles.clickable}>
                    <span className={styles.dot} />#{String(s.visitor_no)} · <span className={styles.path}>{String(s.path)}</span> ·{" "}
                    {[s.city, s.country].filter(Boolean).join(", ") || "Unknown"} · {String(s.browser)} · {duration(Number(s.duration))}
                    {s.is_own ? <span className={styles.badge}>you</span> : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Recent visits</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Started</th>
                    <th>#</th>
                    <th>Source</th>
                    <th>Entry → exit</th>
                    <th>Views</th>
                    <th>Time</th>
                    <th>Where</th>
                    <th>Device</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recent as Row[]).map((s) => (
                    <tr key={String(s.id)} onClick={() => setVisitor(String(s.visitor_id))} className={styles.clickable}>
                      <td>{dt(s.started_at)}</td>
                      <td>#{String(s.visitor_no)}</td>
                      <td>{String(s.source)}</td>
                      <td className={styles.path}>
                        {String(s.entry_path)} → {String(s.exit_path)}
                      </td>
                      <td>{nf.format(Number(s.pageviews))}</td>
                      <td>{duration(Number(s.duration))}</td>
                      <td>{[s.city, s.country].filter(Boolean).join(", ") || "—"}</td>
                      <td>{`${s.browser} · ${s.os} · ${s.device}`}</td>
                      <td>{s.is_own ? <span className={styles.badge}>you</span> : s.is_new ? <span className={styles.badge}>new</span> : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {tab === "Pages" && (
        <section className={styles.grid}>
          <Bars title="Most viewed pages" rows={(data.pages as Row[]).map((p) => ({ label: p.path, visitors: p.views }))} />
          <Bars title="Entry pages" rows={b.entry} />
          <Bars title="Exit pages" rows={b.exit} />
        </section>
      )}

      {tab === "Messages" && (
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Messages</h3>
          {messages.length === 0 ? (
            <p className={styles.mute}>No messages yet.</p>
          ) : (
            messages.map((m) => (
              <article key={String(m.id)} className={styles.messageCard}>
                <p className={styles.messageMeta}>
                  {dt(m.created_at)} · <strong>{String(m.name)}</strong> · <a href={`mailto:${m.email}`}>{String(m.email)}</a> ·{" "}
                  {[m.city, m.country].filter(Boolean).join(", ") || "Unknown"} · <span className={styles.badge}>{String(m.status)}</span>
                  {m.emailed ? "" : <span className={styles.badge}>not emailed</span>}
                </p>
                {m.subject ? <p className={styles.messageSubject}>{String(m.subject)}</p> : null}
                <p className={styles.messageBody}>{String(m.message)}</p>
                <div className={styles.rowActions}>
                  {["read", "replied", "archived", "delete"].map((action) => (
                    <form action={updateMessageAction} key={action}>
                      <input type="hidden" name="id" value={String(m.id)} />
                      <input type="hidden" name="action" value={action} />
                      <button className={styles.ghostButton}>{action}</button>
                    </form>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {tab === "Security" && (
        <>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Active admin sessions</h3>
              <form action={revokeOthersAction}>
                <button className={styles.ghostButton}>Sign out everywhere else</button>
              </form>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Started</th>
                    <th>Last seen</th>
                    <th>Expires</th>
                    <th>Where</th>
                    <th>IP</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(data.admins as Row[]).map((s) => (
                    <tr key={String(s.id)}>
                      <td>
                        {String(s.email)} {s.id === me.sessionId ? <span className={styles.badge}>this device</span> : null}
                      </td>
                      <td>{dt(s.created_at)}</td>
                      <td>{dt(s.last_seen)}</td>
                      <td>{dt(s.expires_at)}</td>
                      <td>{[s.city, s.country].filter(Boolean).join(", ") || "—"}</td>
                      <td>{String(s.ip ?? "—")}</td>
                      <td>
                        <form action={revokeSessionAction}>
                          <input type="hidden" name="id" value={String(s.id)} />
                          <button className={styles.ghostButton}>Revoke</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Login attempts</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Email</th>
                    <th>Result</th>
                    <th>Where</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.logins as Row[]).map((l, i) => (
                    <tr key={i}>
                      <td>{dt(l.ts)}</td>
                      <td>{String(l.email)}</td>
                      <td>{l.success ? "ok" : String(l.reason)}</td>
                      <td>{[l.city, l.country].filter(Boolean).join(", ") || "—"}</td>
                      <td>{String(l.ip ?? "—")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {visitor && <VisitorDrawer id={visitor} onClose={() => setVisitor(null)} />}
    </div>
  );
}
