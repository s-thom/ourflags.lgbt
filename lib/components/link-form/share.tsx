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
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // eslint-disable-next-line no-console
      console.error("Failed to write to clipboard");
    });
  }, [shareUrl]);

  if (flags.length === 0) {
    return (
      <div>
        <div className="inline-flex gap-2 m-2 p-2 border rounded-xl text-neutral-700 dark:text-neutral-400 border-neutral-400 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 min-w-[24rem] max-w-full">
          <div className="grow p-2 px-3 rounded-lg bg-neutral-200 dark:bg-neutral-800">
            {defaultUrl}
          </div>
          <button
            disabled
            className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800"
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
      <div className="inline-flex gap-2 m-2 p-2 border rounded-xl border-green-400 bg-green-100 dark:border-green-800 dark:bg-green-900 min-w-[24rem] max-w-full">
        <div className="select-all grow p-2 px-3 rounded-lg bg-green-200 dark:bg-green-700 overflow-auto">
          {shareUrl}
        </div>
        <button
          className="p-2 rounded-lg bg-green-200 dark:bg-green-700"
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
