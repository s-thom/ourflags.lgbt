// Copyright (c) 2022 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { Check, ClipboardCopy, Cross } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "../../analytics";
import { BASE_URL } from "../../constants";
import { buildShareString } from "../../shortcodes";
import { useSelectedFlags } from "./context";

export function LinkFormShare() {
  const { selected: flags } = useSelectedFlags();

  const shareUrl = useMemo(
    () => `${BASE_URL}/${buildShareString(flags)}`,
    [flags]
  );
  const defaultUrl = useMemo(() => `${BASE_URL}/♡♡♡♡♡♡♡`, []);

  const [copyState, setCopyState] = useState<"ready" | "copied" | "error">(
    "ready"
  );
  useEffect(() => {
    setCopyState("ready");
  }, [shareUrl]);

  const copyUrlToClipboard = useCallback(async () => {
    trackEvent("click", "Copy URL", {});
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to write to clipboard");
      setCopyState("error");
    }
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
          {copyState === "ready" && <ClipboardCopy />}
          {copyState === "copied" && <Check />}
          {copyState === "error" && <Cross />}
        </button>
      </div>
      <div>
        Or{" "}
        <Link
          href={shareUrl}
          className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          onClick={() =>
            trackEvent("click", "Link preview", {
              flagIds: flags.map((flag) => flag.id),
            })
          }
        >
          Preview your page
        </Link>
      </div>
    </div>
  );
}
