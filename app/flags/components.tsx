import Image from "next/image";
import Link from "next/link";
import { getThemedGradients } from "../../lib/colors";
import { FLAG_ASPECT_RATIO } from "../../lib/constants";
import { FlagMeta } from "../../lib/types";

export interface FlagSummaryProps {
  flag: FlagMeta;
}

export async function FlagSummary({ flag }: FlagSummaryProps) {
  const style = getThemedGradients(flag.background);

  return (
    <div
      className="gradient-light dark:gradient-dark flex items-center gap-4 rounded-xl bg-gradient-to-br p-2"
      style={style}
    >
      <div className="shrink-0">
        <Image
          src={`/images/flags/${flag.id}_64.png`}
          alt={flag.name}
          height={64}
          width={64 * FLAG_ASPECT_RATIO}
          className="rounded-lg"
        />
      </div>
      <div>
        <h2 className="font-headings text-3xl">{flag.name}</h2>
        <div className="prose prose-neutral dark:prose-invert">
          <Link
            href={`/flags/${flag.id}`}
            className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
          >
            Read more…
          </Link>
        </div>
      </div>
    </div>
  );
}
