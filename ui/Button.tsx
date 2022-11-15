import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

type HtmlButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonProps = {
  children: string;
  iconLeft?: IconProp;
  iconRight?: IconProp;
  extraClasses?: string;
  href?: string;
} & VariantProps<typeof button>;

const button = cva(
  "block px-4 py-3 rounded-lg transition-all hover:lg bg-slate-200 hover:bg-slate-300 text-center font-semibold hover:shadow-xl",
  {
    variants: {
      variant: {
        primary: "bg-slate-800 text-white hover:bg-slate-900",
        accent: "bg-amber-500 hover:bg-amber-600",
        red: "bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-700",
        green:
          "bg-emerald-200 hover:bg-emerald-300 text-emerald-800 hover:text-emerald-900",
      },
      fullWidth: {
        true: "w-full",
      },
    },
  }
);

export const Button: FC<
  ButtonProps & Omit<HtmlButtonProps, keyof ButtonProps | "className">
> = ({
  children,
  iconLeft,
  iconRight,
  fullWidth,
  variant,
  extraClasses,
  href,
  ...rest
}) => {
  const c = button({
    variant: variant,
    fullWidth: fullWidth,
    class: extraClasses,
  });
  const kids = (
    <>
      {iconLeft && <FontAwesomeIcon icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon icon={iconRight} />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={c}>
        {kids}
      </Link>
    );
  }
  return (
    <button className={c} {...rest}>
      {kids}
    </button>
  );
};
