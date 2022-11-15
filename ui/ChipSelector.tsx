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
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}> = ({ onSelect, options, selected }) => {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => {
        return (
          <div
            key={option}
            onClick={() => onSelect(option)}
            className={optionClasses({ active: option === selected })}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};
