"use client";

import { ClipboardCopy } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { buildShareString } from "../../shortcodes";
import { useBaseUrl } from "../../urls";
import { useSelectedFlags } from "./context";

export function LinkFormShare() {
  const baseUrl = useBaseUrl();

  const { selected: flags } = useSelectedFlags();

  const shareUrl = useMemo(
    () => `${baseUrl}/${buildShareString(flags)}`,
    [baseUrl, flags]
  );
  const defaultUrl = useMemo(() => `${baseUrl}/♡♡♡♡♡♡♡`, [baseUrl]);

  const copyUrlToClipboard = useCallback(() => {
    umami?.trackEvent("Copy URL", { type: "click" });
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // eslint-disable-next-line no-console
      console.error("Failed to write to clipboard");
    });
  }, [shareUrl]);

  if (flags.length === 0) {
    return (
      <div>
        <div className="m-2 inline-flex min-w-[24rem] max-w-full gap-2 rounded-xl border border-neutral-400 bg-neutral-100 p-2 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          <div className="grow rounded-lg bg-neutral-200 p-2 px-3 dark:bg-neutral-800">
            {defaultUrl}
          </div>
          <button
            disabled
            className="rounded-lg bg-neutral-200 p-2 dark:bg-neutral-800"
            aria-label="Copy URL to clipboard"
            onClick={copyUrlToClipboard}
          >
            <ClipboardCopy />
          </button>
        </div>
        <div>Select flags to get a URL</div>
      </div>
    );
  }
  return (
    <div>
      <div className="m-2 inline-flex min-w-[24rem] max-w-full gap-2 rounded-xl border border-green-400 bg-green-100 p-2 dark:border-green-800 dark:bg-green-900">
        <div className="grow select-all overflow-auto rounded-lg bg-green-200 p-2 px-3 dark:bg-green-700">
          {shareUrl}
        </div>
        <button
          className="rounded-lg bg-green-200 p-2 dark:bg-green-700"
          aria-label="Copy share URL"
          onClick={copyUrlToClipboard}
        >
          <ClipboardCopy />
        </button>
      </div>
      <div>
        Or{" "}
        <Link
          href={shareUrl}
          className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
        >
          Preview your page
        </Link>
      </div>
    </div>
  );
}
