import { Plus, Trash2 } from "lucide-react";
import { FlagMeta } from "../../types/types";

export interface FlagChipProps {
  flag: FlagMeta;
  onClick?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

export function FlagChip({ flag, onClick, onAdd, onRemove }: FlagChipProps) {
  const hasAdditionalActions = !!(onRemove || onAdd);
  const TextComponent = onClick ? "button" : "div";

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
    <div className="inline-block px-1 rounded border border-neutral-400">
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
