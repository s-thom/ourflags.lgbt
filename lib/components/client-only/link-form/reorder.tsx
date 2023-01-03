// Copyright (c) 2023 Stuart Thomson.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { CSSProperties, useCallback } from "react";
import { trackEvent } from "../../../analytics";
import { FlagFormChip, FlagFormChipProps } from "./chip";
import { useLinkFormState, useSelectedFlags } from "./context";

function DraggableChip(
  props: FlagFormChipProps & {
    onMovePlaces?: (places: number) => void;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
  }
) {
  const { flag, style: baseStyle, before } = props;

  const [selectedFlagIds, setSelectedFlagIds] = useLinkFormState();
  const currentIndex = selectedFlagIds.indexOf(flag.id);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: flag.id });

  const moveFlag = useCallback(
    (places: number) => {
      if (currentIndex === -1) {
        return;
      }

      const newIndex = Math.max(
        Math.min(currentIndex + places, selectedFlagIds.length - 1),
        0
      );
      const newIds = selectedFlagIds.filter((id) => flag.id !== id);
      newIds.splice(newIndex, 0, flag.id);

      setSelectedFlagIds(newIds);
    },
    [currentIndex, flag.id, selectedFlagIds, setSelectedFlagIds]
  );

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...baseStyle,
  };

  return (
    <FlagFormChip
      {...props}
      className={clsx("basis-full md:basis-auto md:touch-none")}
      style={style}
      ref={setNodeRef}
      before={
        <div className={clsx("inline-flex items-center gap-2")}>
          {before}
          <button
            className={clsx(
              "hidden md:inline-block",
              "custom-transition-hover focus-within:scale-110 hover:scale-110"
            )}
            aria-hidden
            aria-label={`Drag ${flag.name}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </button>
          <div className={clsx("inline-flex items-center gap-2", "group/move")}>
            <button
              className={clsx(
                "disabled:text-neutral-400",
                "md:sr-only md:group-focus-within/move:not-sr-only",
                "custom-transition-hover focus-within:scale-110 hover:scale-110"
              )}
              disabled={currentIndex === 0}
              aria-label={`Move ${flag.name} left`}
              onClick={() => moveFlag(-1)}
            >
              <ArrowUp />
            </button>
            <button
              className={clsx(
                "disabled:text-neutral-400",
                "md:sr-only md:group-focus-within/move:not-sr-only",
                "custom-transition-hover focus-within:scale-110 hover:scale-110"
              )}
              disabled={currentIndex === selectedFlagIds.length - 1}
              aria-label={`Move ${flag.name} right`}
              onClick={() => moveFlag(1)}
            >
              <ArrowDown />
            </button>
          </div>
        </div>
      }
    />
  );
}

export function FlagFormReorder() {
  const [selectedFlagIds, setSelectedFlagIds] = useLinkFormState();
  const { selected } = useSelectedFlags();

  const removeFlag = (id: string) => {
    setSelectedFlagIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : current
    );
    trackEvent("click", "Remove flag", {
      flagId: id,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over!.id) {
        setSelectedFlagIds((ids) => {
          const oldIndex = ids.indexOf(active.id as string);
          const newIndex = ids.indexOf(over!.id as string);

          return arrayMove(ids, oldIndex, newIndex);
        });
      }
    },
    [setSelectedFlagIds]
  );

  if (selected.length === 0) {
    return <></>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={selectedFlagIds} strategy={rectSortingStrategy}>
        <div
          className={clsx(
            "inline-flex flex-wrap gap-2 rounded-xl",
            "border border-dashed border-neutral-400 bg-neutral-100 p-2 dark:border-neutral-800 dark:bg-neutral-900",
            "w-[24rem] max-w-full md:w-auto md:min-w-[24rem]"
          )}
        >
          <div className="basis-full text-center text-neutral-700 dark:text-neutral-400">
            Reorder your flags
          </div>
          {selected.map((flag) => (
            <DraggableChip
              key={flag.id}
              flag={flag}
              onFlagClick={() => removeFlag(flag.id)}
              after={
                <button
                  className={clsx(
                    "custom-transition-hover focus-within:scale-110 hover:scale-110"
                  )}
                  aria-label={`Remove ${flag.name}`}
                  onClick={() => removeFlag(flag.id)}
                >
                  <Trash2 />
                </button>
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
