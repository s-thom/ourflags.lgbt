import { ClipboardCopy } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export interface LinkCopyProps {
  href: string;
  showLinkIcon?: boolean;
}

export function LinkCopy({ href, showLinkIcon }: LinkCopyProps) {
  const copyUrlToClipboard = useCallback(() => {
    navigator.clipboard.writeText(href).catch(() => {
      // eslint-disable-next-line no-console
      console.error("Failed to write to clipboard");
    });
  }, [href]);

  return (
    <div className="inline-flex gap-1 m-2 p-2 border rounded border-green-400 bg-green-100">
      <div className="select-all px-1 rounded bg-green-200">{href}</div>
      <button aria-label="Copy share URL" onClick={copyUrlToClipboard}>
        <ClipboardCopy />
      </button>
      {showLinkIcon && <Link href={href}>Preview</Link>}
    </div>
  );
}

export function EmptyLinkCopy() {
  return (
    <div className="inline-flex gap-1 m-2 p-2 border rounded border-neutral-400 bg-neutral-100">
      Select some flags
    </div>
  );
}
