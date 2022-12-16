"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { FlagMeta } from "../../types/types";

export interface FlagChipProps {
  flag: FlagMeta;
  hasDragHandle?: boolean;
  onClick?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function FlagChip({
  flag,
  hasDragHandle,
  onClick,
  onAdd,
  onRemove,
}: FlagChipProps) {
  const hasAdditionalActions = !!(hasDragHandle || onRemove || onAdd);
  const TextComponent = onClick ? "button" : "div";

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: flag.id, disabled: !hasAdditionalActions });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!hasAdditionalActions) {
    return (
      <TextComponent
        className="inline-block px-1 rounded border border-neutral-400"
        onClick={onClick}
      >
        {flag.name}
      </TextComponent>
    );
  }

  return (
    <div
      className="inline-flex gap-1 px-1 rounded border border-neutral-400"
      style={style}
      ref={setNodeRef}
    >
      {hasDragHandle && (
        <button {...listeners} {...attributes}>
          <GripVertical />
        </button>
      )}
      <TextComponent onClick={onClick}>{flag.name}</TextComponent>
      {onAdd && (
        <button onClick={onAdd}>
          <Plus aria-label={`Add ${flag.name}`} />
        </button>
      )}
      {onRemove && (
        <button onClick={onRemove}>
          <Trash2 aria-label={`Remove ${flag.name}`} />
        </button>
      )}
    </div>
  );
}
