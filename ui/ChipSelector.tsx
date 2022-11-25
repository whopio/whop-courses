import { cva } from "class-variance-authority";
import { FC } from "react";

const optionClasses = cva(
  "rounded-lg px-4 py-2 transition-all cursor-pointer select-none",
  {
    variants: {
      active: {
        true: "bg-slate-800 text-white",
        false: "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
      },
    },
  }
);

export const ChipSelector: FC<{
  options: (string | { value: string; label: string })[];
  selected: string;
  onSelect: (option: string) => void;
}> = ({ onSelect, options, selected }) => {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => {
        const value = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        return (
          <div
            key={value}
            onClick={() => onSelect(value)}
            className={optionClasses({ active: value === selected })}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};
