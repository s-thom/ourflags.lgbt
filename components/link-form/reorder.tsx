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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback } from "react";
import { FlagFormChip } from "./chip";
import { useLinkFormState, useSelectedFlags } from "./context";

export function FlagFormReorder() {
  const [selectedFlagIds, setSelectedFlagIds] = useLinkFormState();
  const { selected } = useSelectedFlags();

  const removeFlag = (id: string) =>
    setSelectedFlagIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : current
    );

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
      <SortableContext
        items={selectedFlagIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 p-2 border border-dashed rounded-xl border-neutral-400 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 min-w-[24rem] max-w-full">
          <div className="text-center text-neutral-700 dark:text-neutral-400">
            Reorder your flags
          </div>{" "}
          <div className="flex flex-wrap gap-2">
            {selected.map((flag) => (
              <FlagFormChip
                key={flag.id}
                flag={flag}
                onRemove={() => removeFlag(flag.id)}
                hasDragHandle
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
