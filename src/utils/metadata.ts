import { baseURL } from "@/resources";
import { Meta } from "@once-ui-system/core";
import type { Metadata } from "next";

type MetaArgs = Parameters<typeof Meta.generate>[0];

/**
 * Page metadata with a canonical URL.
 *
 * Once UI's `Meta.generate` only emits `alternates.canonical` when language
 * alternates are passed, so every page here would ship without one — and the
 * site answers on two origins (aghyad.site and the Vercel URL). This wrapper
 * always pins the canonical to the production origin.
 */
export function pageMetadata(args: MetaArgs): Metadata {
  const origin = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const path = args.path ?? "";
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const canonical = args.canonical ?? `${origin}${normalizedPath}`;

  return {
    ...Meta.generate({ ...args, canonical }),
    alternates: { canonical },
  };
}
