import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { buttonCompoundVariants } from "./Button";

const iconButton = cva(
  "rounded-full hover:shadow-lg transition-all flex items-center justify-center cursor-pointer",
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

type IconButtonProps = {
  icon: IconProp;
  extraClasses?: string;
  href?: string;
} & VariantProps<typeof iconButton>;

export const IconButton: FC<
  IconButtonProps & Omit<HtmlButtonProps, keyof IconButtonProps>
> = ({ icon, variant, href, extraClasses, size, color, ...rest }) => {
  const c = iconButton({ variant, size, color, class: extraClasses });
  if (href) {
    return (
      <Link href={href} className={c}>
        <FontAwesomeIcon icon={icon} />
      </Link>
    );
  }
  return (
    <button className={c} {...rest}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};
