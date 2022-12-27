"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGradientStops } from "../../lib/colors";
import { FLAG_ASPECT_RATIO } from "../../lib/constants";
import { FlagMeta } from "../../types/types";

export interface FlagFormChipProps {
  flag: FlagMeta;
  hasDragHandle?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function FlagFormChip({
  flag,
  hasDragHandle,
  onAdd,
  onRemove,
}: FlagFormChipProps) {
  const hasAdditionalActions = !!(hasDragHandle || onRemove || onAdd);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: flag.id, disabled: !hasAdditionalActions });

  const { style: gradientStyles } = useGradientStops(flag.background);

  const dndStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="inline-flex gap-2 p-2 rounded-lg border border-neutral-500 dark:border-neutral-200 bg-gradient-to-br gradient-light dark:gradient-dark"
      style={{ ...dndStyles, ...gradientStyles }}
      ref={setNodeRef}
    >
      {hasDragHandle && (
        <button
          aria-label={`Move: ${flag.name}`}
          {...listeners}
          {...attributes}
        >
          <GripVertical />
        </button>
      )}
      <Image
        src={`/images/flags/${flag.id}_24.png`}
        alt={flag.name}
        title={flag.name}
        height={24}
        width={24 * FLAG_ASPECT_RATIO}
        className="rounded"
      />
      <Link
        title={flag.name}
        href={`/flags/${flag.id}`}
        className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
      >
        {flag.shortName ?? flag.name}
      </Link>
      {onAdd && (
        <button aria-label={`Add: ${flag.name}`} onClick={onAdd}>
          <Plus />
        </button>
      )}
      {onRemove && (
        <button aria-label={`Remove: ${flag.name}`} onClick={onRemove}>
          <Trash2 />
        </button>
      )}
    </div>
  );
}
