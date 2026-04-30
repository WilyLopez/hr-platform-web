"use client";
import { useState } from "react";
import { Input } from "@/components/ui";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui";

interface Filter {
  key:      string;
  label:    string;
  options:  { value: string; label: string }[];
}

interface TableFiltersProps {
  onSearch?:       (value: string) => void;
  searchPlaceholder?: string;
  filters?:        Filter[];
  onFilterChange?: (key: string, value: string) => void;
  onClear?:        () => void;
  activeCount?:    number;
}

export function TableFilters({
  onSearch,
  searchPlaceholder = "Buscar...",
  filters,
  onFilterChange,
  onClear,
  activeCount = 0,
}: TableFiltersProps) {
  const [search, setSearch] = useState("");

  function handleSearch(value: string) {
    setSearch(value);
    onSearch?.(value);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-neutral-200">
      {onSearch && (
        <div className="flex-1 min-w-48 max-w-72">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            rightIcon={
              search ? (
                <button onClick={() => handleSearch("")}>
                  <X size={14} />
                </button>
              ) : null
            }
          />
        </div>
      )}
      {filters?.map((f) => (
        <select
          key={f.key}
          className="form-input w-auto min-w-32 text-sm"
          onChange={(e) => onFilterChange?.(f.key, e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {activeCount > 0 && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} leftIcon={<X size={13} />}>
          Limpiar ({activeCount})
        </Button>
      )}
    </div>
  );
}