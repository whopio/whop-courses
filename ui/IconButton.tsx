import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

const iconButton = cva(
  "rounded-full bg-slate-200 hover:bg-slate-300 hover:shadow-sm transition-all flex items-center justify-center w-10 h-10 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-slate-800 hover:bg-slate-900",
        red: "bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-700",
      },
      size: {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      },
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
> = ({ icon, variant, href, extraClasses, ...rest }) => {
  const c = iconButton({ variant, class: extraClasses });
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
