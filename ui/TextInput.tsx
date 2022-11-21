import { cva } from "class-variance-authority";
import {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type TextInputProps = { label?: string } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type TextAreaProps = { label?: string } & DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const inputClasses = cva(
  "block py-2 px-4 w-full rounded-lg border-2 border-neutral-200 outline-none focus:outline-none transition focus:border-accent-500"
);

export const TextInput: FC<TextInputProps> = ({
  label,
  className,
  ...props
}) => {
  const classes = inputClasses({ className });
  return (
    <div>
      {label && <label className="block text-sm mb-1 font-bold">{label}</label>}
      <input type={"text"} className={classes} {...props} />
    </div>
  );
};

export const TextArea: FC<TextAreaProps> = ({ label, ...props }) => {
  const classes = inputClasses({});
  return (
    <div>
      {label && <label className="block text-sm mb-1 font-bold">{label}</label>}
      <textarea className={classes} {...props} />
    </div>
  );
};
