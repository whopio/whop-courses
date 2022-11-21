import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { buttonCompoundVariants } from "./Button";

const iconButton = cva(
  "rounded-full hover:shadow-lg transition-all flex items-center justify-center cursor-pointer active:scale-105 active:-rotate-6",
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
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10",
        lg: "w-14 h-14 text-xl",
        xl: "w-20 h-20 text-3xl",
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

type HtmlButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type BaseIconButtonProps = {
  icon: IconProp;
  extraClasses?: string;
} & VariantProps<typeof iconButton>;

type IconButtonProps = BaseIconButtonProps &
  (
    | ({ link?: false } & Omit<
        HtmlButtonProps,
        keyof BaseIconButtonProps | "className"
      >)
    | ({ link: true } & Omit<
        LinkProps,
        keyof BaseIconButtonProps | "className"
      >)
  );

export const IconButton: FC<IconButtonProps> = ({
  icon,
  variant,
  extraClasses,
  size,
  color,
  ...rest
}) => {
  const c = iconButton({ variant, size, color, class: extraClasses });
  if (rest.link) {
    return (
      <Link {...rest} className={c}>
        <FontAwesomeIcon icon={icon} />
      </Link>
    );
  }
  return (
    <button {...rest} className={c}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};
