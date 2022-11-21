import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type HtmlButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const buttonCompoundVariants: {
  variant: "light" | "outline" | "filled";
  color: "primary" | "accent" | "neutral" | "danger" | "success";
  class: string;
}[] = [
  {
    variant: "light",
    color: "danger",
    class: "bg-red-200 hover:bg-red-300 text-red-700 hover:text-red-800",
  },
  {
    variant: "outline",
    color: "danger",
    class:
      "border-2 border-red-600 hover:border-red-700 text-red-600 hover:text-red-700",
  },
  {
    variant: "filled",
    color: "danger",
    class: "bg-red-500 hover:bg-red-600",
  },
  {
    variant: "light",
    color: "success",
    class:
      "bg-emerald-200 hover:bg-emerald-300 text-emerald-700 hover:text-emerald-800",
  },
  {
    variant: "outline",
    color: "success",
    class:
      "border-2 border-emerald-600 hover:border-emerald-700 text-emerald-600 hover:text-emerald-700",
  },
  {
    variant: "filled",
    color: "success",
    class: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    variant: "light",
    color: "primary",
    class:
      "bg-primary-200 hover:bg-primary-300 text-primary-700 hover:text-primary-800",
  },
  {
    variant: "outline",
    color: "primary",
    class:
      "border-2 border-primary-600 hover:border-primary-700 text-primary-600 hover:text-primary-700",
  },
  {
    variant: "filled",
    color: "primary",
    class: "bg-primary-500 hover:bg-primary-600",
  },
  {
    variant: "light",
    color: "neutral",
    class:
      "bg-neutral-200 hover:bg-neutral-300 text-neutral-800 hover:text-neutral-900",
  },
  {
    variant: "outline",
    color: "neutral",
    class:
      "border-2 border-neutral-800 hover:border-neutral-900 text-neutral-800 hover:text-neutral-900",
  },
  {
    variant: "filled",
    color: "neutral",
    class: "bg-neutral-800 hover:bg-neutral-700 text-white",
  },
  {
    variant: "light",
    color: "accent",
    class:
      "bg-accent-200 hover:bg-accent-300 text-accent-700 hover:text-accent-800",
  },
  {
    variant: "outline",
    color: "accent",
    class:
      "border-2 border-accent-600 hover:border-accent-700 text-accent-600 hover:text-accent-700",
  },
  {
    variant: "filled",
    color: "accent",
    class: "bg-accent-500 hover:bg-accent-600",
  },
];

type ButtonBaseProps = {
  children: string;
  iconLeft?: IconProp;
  iconRight?: IconProp;
  extraClasses?: string;
  disabled?: boolean;
  loading?: boolean;
} & VariantProps<typeof button>;

type ButtonProps = ButtonBaseProps &
  (
    | ({ link?: false } & Omit<
        HtmlButtonProps,
        keyof ButtonBaseProps | "className"
      >)
    | ({ link: true } & Omit<LinkProps, keyof ButtonBaseProps | "className">)
  );

const button = cva(
  "flex flex-nowrap items-center justify-center rounded-lg transition-all font-semibold hover:shadow-lg gap-2 self-start active:scale-105 active:-rotate-1",
  {
    variants: {
      variant: {
        filled: "",
        outline: "",
        light: "",
      },
      color: {
        danger: "",
        success: "",
        primary: "",
        accent: "",
        neutral: "",
      },
      size: {
        xs: "px-2 py-1 text-xs",
        sm: "px-3 py-1.5 text-sm",
        md: "px-3 py-2",
        lg: "px-5 py-3 text-xl",
        xl: "px-8 py-4 text-3xl",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: buttonCompoundVariants,
    defaultVariants: {
      variant: "light",
      color: "neutral",
      size: "md",
    },
  }
);

export function Button(props: ButtonProps) {
  const {
    variant,
    color,
    size,
    fullWidth,
    extraClasses,
    children,
    iconLeft,
    iconRight,
    disabled,
    loading,
    ...rest
  } = props;
  const c = button({
    variant: disabled ? "light" : variant,
    color: disabled ? "neutral" : color,
    size: size,
    fullWidth: fullWidth,
    class: extraClasses,
  });
  const kids = (
    <>
      {iconLeft &&
        (loading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        ) : (
          <FontAwesomeIcon icon={iconLeft} />
        ))}
      {children}
      {iconRight && <FontAwesomeIcon icon={iconRight} />}
    </>
  );
  if (rest.link === true) {
    return (
      <Link className={c} {...rest}>
        {kids}
      </Link>
    );
  } else {
    return (
      <button className={c} disabled={disabled} {...rest}>
        {kids}
      </button>
    );
  }
}
