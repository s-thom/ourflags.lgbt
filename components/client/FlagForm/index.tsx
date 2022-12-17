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
import { ClipboardCopy } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { buildShareString } from "../../../lib/shortcodes";
import { getUrlBase } from "../../../lib/urls";
import { FlagMeta } from "../../../types/types";
import { FlagChip } from "../FlagChip";

export interface FlagFormProps {
  flags: FlagMeta[];
}

export function FlagForm({ flags }: FlagFormProps) {
  const [selectedFlagIds, setSelectedFlagIds] = useState<string[]>([]);
  const addFlag = (id: string) =>
    setSelectedFlagIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
  const removeFlag = (id: string) =>
    setSelectedFlagIds((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : current
    );

  const { selectedFlags, unselectedFlags } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const selectedFlags: FlagMeta[] = [];
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const unselectedFlags: FlagMeta[] = [];

    // TODO: not O(n^2)
    for (const flag of flags) {
      if (selectedFlagIds.includes(flag.id)) {
        selectedFlags.push(flag);
      } else {
        unselectedFlags.push(flag);
      }
    }

    // TODO: also optimise this thx
    selectedFlags.sort(
      (a, z) => selectedFlagIds.indexOf(a.id) - selectedFlagIds.indexOf(z.id)
    );

    return { selectedFlags, unselectedFlags };
  }, [flags, selectedFlagIds]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over!.id) {
      setSelectedFlagIds((ids) => {
        const oldIndex = ids.indexOf(active.id as string);
        const newIndex = ids.indexOf(over!.id as string);

        return arrayMove(ids, oldIndex, newIndex);
      });
    }
  }, []);

  const shareUrl = useMemo(
    () => `${getUrlBase()}${buildShareString(selectedFlags)}`,
    [selectedFlags]
  );

  const copyUrlToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // eslint-disable-next-line no-console
      console.error("Failed to write to clipboard");
    });
  }, [shareUrl]);

  return (
    <div>
      <div className="flex gap-1 m-2 p-2 border rounded border-neutral-400">
        {unselectedFlags.map((flag) => (
          <FlagChip key={flag.id} flag={flag} onAdd={() => addFlag(flag.id)} />
        ))}
      </div>
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
          <div className="flex gap-1 m-2 p-2 border rounded border-green-400">
            {selectedFlags.map((flag) => (
              <FlagChip
                key={flag.id}
                flag={flag}
                onRemove={() => removeFlag(flag.id)}
                hasDragHandle
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="inline-flex gap-1 m-2 p-2 border rounded border-green-400 bg-green-100">
        <div className="select-all px-1 rounded bg-green-200">{shareUrl}</div>
        <button aria-label="Copy share URL" onClick={copyUrlToClipboard}>
          <ClipboardCopy />
        </button>
      </div>
    </div>
  );
}
