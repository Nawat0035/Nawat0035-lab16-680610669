import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  ChevronDown,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type ComboboxOption = {
  value: string;
  label: string;
};

type MultiComboboxProps = {
  options: ComboboxOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
  emptyText?: string;
  addText?: string;
  disabled?: boolean;
};

export function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder = "เลือก...",
  allowCustom = false,
  emptyText = "ไม่พบข้อมูล",
  addText = "เพิ่ม",
  disabled = false,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        !rootRef.current?.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  const filteredOptions = useMemo(() => {
    const normalized = query
      .trim()
      .toLowerCase();

    if (!normalized) {
      return options;
    }

    return options.filter((option) =>
      option.label
        .toLowerCase()
        .includes(normalized),
    );
  }, [options, query]);

  const customValue = query.trim();

  const customExists = options.some(
    (option) =>
      option.label.toLowerCase() ===
      customValue.toLowerCase(),
  );

  const customSelected = value.some(
    (item) =>
      item.toLowerCase() ===
      customValue.toLowerCase(),
  );

  const selectValue = (item: string) => {
    if (value.includes(item)) {
      onValueChange(
        value.filter(
          (current) => current !== item,
        ),
      );
    } else {
      onValueChange([
        ...value,
        item,
      ]);
    }

    setQuery("");
  };

  const removeValue = (item: string) => {
    onValueChange(
      value.filter(
        (current) => current !== item,
      ),
    );
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full"
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        onClick={() =>
          setOpen((current) => !current)
        }
        className="
          flex min-h-8 w-full items-center
          justify-between gap-2 rounded-lg
          border border-input bg-transparent
          px-2.5 py-1.5 text-left text-sm
          outline-none transition-colors
          focus-visible:border-ring
          focus-visible:ring-3
          focus-visible:ring-ring/50
          disabled:cursor-not-allowed
          disabled:opacity-50
          dark:bg-input/30
        "
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">
          {value.length === 0 ? (
            <span className="py-0.5 text-muted-foreground">
              {placeholder}
            </span>
          ) : (
            value.map((item) => {
              const option = options.find(
                (current) =>
                  current.value === item,
              );

              const label =
                option?.label ?? item;

              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className="max-w-full"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <span className="max-w-[220px] truncate">
                    {label}
                  </span>

                  <button
                    type="button"
                    className="
                      ml-0.5 rounded-full
                      outline-none
                      hover:text-destructive
                    "
                    onClick={(event) => {
                      event.stopPropagation();
                      removeValue(item);
                    }}
                    aria-label={`ลบ ${label}`}
                  >
                    <X />
                  </button>
                </Badge>
              );
            })
          )}
        </div>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          className="
            absolute top-full left-0 z-50 mt-1
            w-full min-w-56 overflow-hidden
            rounded-lg border bg-popover
            p-1 text-popover-foreground
            shadow-md
          "
        >
          <div className="p-1">
            <Input
              autoFocus
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="พิมพ์เพื่อค้นหา..."
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                }
              }}
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {allowCustom &&
              customValue &&
              !customExists &&
              !customSelected && (
                <button
                  type="button"
                  className="
                    flex w-full items-center
                    rounded-md px-2 py-1.5
                    text-left text-sm
                    hover:bg-accent
                    hover:text-accent-foreground
                  "
                  onClick={() =>
                    selectValue(customValue)
                  }
                >
                  <span>
                    + {addText} "{customValue}"
                  </span>
                </button>
              )}

            {filteredOptions.length === 0 &&
              !customValue && (
                <div className="
                  px-2 py-3 text-center
                  text-sm text-muted-foreground
                ">
                  {emptyText}
                </div>
              )}

            {filteredOptions.map((option) => {
              const selected =
                value.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  className="
                    flex w-full items-center
                    justify-between rounded-md
                    px-2 py-1.5 text-left text-sm
                    hover:bg-accent
                    hover:text-accent-foreground
                  "
                  onClick={() =>
                    selectValue(option.value)
                  }
                >
                  <span className="truncate">
                    {option.label}
                  </span>

                  {selected && (
                    <Check className="size-4 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}