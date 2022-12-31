// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useCallback } from "react";
import { trackEvent } from "../../analytics";
import { useGradientStops } from "../../colors";
import { FLAG_ASPECT_RATIO } from "../../constants";
import { FlagMeta } from "../../types";

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

  const onAddClick = useCallback(() => {
    trackEvent("click", "Add flag", {
      type: "click",
      action: "add",
      flagId: flag.id,
    });
    onAdd?.();
  }, [flag.id, onAdd]);
  const onRemoveClick = useCallback(() => {
    trackEvent("click", "Remove flag", {
      type: "click",
      action: "remove",
      flagId: flag.id,
    });
    onRemove?.();
  }, [flag.id, onRemove]);

  const image = (
    <Image
      src={`/images/flags/${flag.id}_24.png`}
      alt={flag.name}
      title={flag.name}
      height={24}
      width={24 * FLAG_ASPECT_RATIO}
      className="rounded"
    />
  );
  let imageButton: ReactNode;
  if (onAdd) {
    imageButton = (
      <button aria-label={`Add: ${flag.name}`} onClick={onAddClick}>
        {image}
      </button>
    );
  } else if (onRemove) {
    imageButton = (
      <button aria-label={`Remove: ${flag.name}`} onClick={onRemoveClick}>
        {image}
      </button>
    );
  } else {
    imageButton = image;
  }

  return (
    <div
      className="gradient-light dark:gradient-dark inline-flex gap-2 rounded-lg border border-neutral-500 bg-gradient-to-br p-2 dark:border-neutral-200"
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
      {imageButton}
      <Link
        title={flag.name}
        href={`/flags/${flag.id}`}
        className="underline decoration-dotted hover:decoration-solid focus:decoration-solid"
      >
        {flag.shortName ?? flag.name}
      </Link>
      {onAdd && (
        <button aria-label={`Add: ${flag.name}`} onClick={onAddClick}>
          <Plus />
        </button>
      )}
      {onRemove && (
        <button aria-label={`Remove: ${flag.name}`} onClick={onRemoveClick}>
          <Trash2 />
        </button>
      )}
    </div>
  );
}
