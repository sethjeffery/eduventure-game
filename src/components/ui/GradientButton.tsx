import React from "react";
import clsx from "clsx";

export interface GradientButtonProps {
  arrow?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: Variant;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  gradient?: string;
  hoverGradient?: string;
  shadow?: "light" | "dark";
  iconBg?: string;
  type?: "button" | "submit" | "reset";
}

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "white"
  | "custom";

const VARIANT_STYLES: Record<
  Variant,
  {
    gradient: string;
    hoverGradient: string;
    shadow: string;
    iconBg: string;
  }
> = {
  primary: {
    gradient: "bg-gradient-to-br from-purple-400 via-purple-500 to-fuchsia-600",
    hoverGradient:
      "hover:from-purple-500 hover:via-purple-600 hover:to-fuchsia-700",
    shadow: "shadow-purple-200",
    iconBg: "bg-gradient-to-br from-purple-700/50 to-purple-800/25",
  },
  secondary: {
    gradient: "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600",
    hoverGradient: "hover:from-gray-500 hover:via-gray-600 hover:to-gray-700",
    shadow: "shadow-gray-200",
    iconBg: "bg-gradient-to-br from-gray-700/50 to-gray-800/25",
  },
  success: {
    gradient: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
    hoverGradient:
      "hover:from-green-500 hover:via-green-600 hover:to-green-700",
    shadow: "shadow-green-200",
    iconBg: "bg-gradient-to-br from-green-700/50 to-green-700/25",
  },
  warning: {
    gradient: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500",
    hoverGradient:
      "hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600",
    shadow: "shadow-yellow-200",
    iconBg: "bg-gradient-to-br from-yellow-700/50 to-yellow-700/25",
  },
  danger: {
    gradient: "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
    hoverGradient: "hover:from-red-500 hover:via-red-600 hover:to-red-700",
    shadow: "shadow-red-200",
    iconBg: "bg-gradient-to-br from-red-800/50 to-red-800/25",
  },
  info: {
    gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600",
    hoverGradient: "hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700",
    shadow: "shadow-blue-200",
    iconBg: "bg-gradient-to-br from-blue-700/50 to-blue-800/25",
  },
  white: {
    gradient: "bg-gradient-to-br from-white to-gray-200",
    hoverGradient: "hover:bg-gray-100",
    shadow: "shadow-gray-200",
    iconBg: "bg-gradient-to-br from-gray-300/50 to-white/25",
  },
  custom: {
    gradient: "",
    hoverGradient: "",
    shadow: "",
    iconBg: "",
  },
};

const SIZE_STYLES = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function GradientButton({
  arrow = false,
  children,
  onClick,
  disabled = false,
  className = "",
  icon,
  iconBg,
  variant = "primary",
  size = "md",
  fullWidth = false,
  gradient,
  hoverGradient,
  shadow = "dark",
  type = "button",
}: GradientButtonProps) {
  const variantStyles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  // Use custom gradients if provided, otherwise use variant styles
  const finalGradient = gradient || variantStyles.gradient;
  const finalHoverGradient = hoverGradient || variantStyles.hoverGradient;
  const finalShadow = shadow === "dark" ? "" : variantStyles.shadow;
  const finalIconBg = iconBg || variantStyles.iconBg;

  const buttonClasses = clsx(
    // Base styles
    "relative overflow-hidden",
    "rounded-xl",
    "transition-all duration-300 transform",
    "shadow-lg",

    // Size styles
    sizeStyles,

    // Gradient and shadow styles
    finalGradient,
    finalShadow,

    // Conditional styles
    {
      "w-full": fullWidth,
      "text-black": variant === "white",
      "text-white": variant !== "white",
    },

    // Disabled state
    disabled
      ? "opacity-50 cursor-not-allowed"
      : ["cursor-pointer group", "hover:scale-[102%]", finalHoverGradient],

    // Custom className
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {/* Shine effect overlay - only when not disabled */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-700 ease-out"></div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3 justify-between">
        {icon && (
          <div
            className={clsx(
              "p-2 rounded-full inset-shadow-sm transition-all duration-300",
              finalIconBg,
              !disabled && "group-hover:bg-opacity-70"
            )}
          >
            {icon}
          </div>
        )}

        <div className={icon || arrow ? "mr-auto" : "mx-auto"}>{children}</div>

        {arrow && (
          <div
            className={clsx(
              "transform transition-transform duration-300",
              !disabled && "group-hover:translate-x-1"
            )}
          >
            <svg
              className="w-6 h-6 drop-shadow-sm"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// Convenience component for buttons with icons
interface GradientButtonWithIconProps extends GradientButtonProps {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function GradientButtonWithIcon({
  children,
  iconPosition = "left",
  icon,
  variant = "primary",
  ...props
}: GradientButtonWithIconProps) {
  const variantStyles = VARIANT_STYLES[variant];
  const finalIconBg = props.iconBg || variantStyles.iconBg;

  return (
    <GradientButton variant={variant} {...props}>
      <div className="flex items-center gap-3">
        {iconPosition === "left" && icon && (
          <div
            className={clsx(
              "p-2 rounded-full inset-shadow-sm group-hover:bg-opacity-70 transition-all duration-300",
              finalIconBg
            )}
          >
            {icon}
          </div>
        )}
        <span className="drop-shadow-sm">{children}</span>
        {iconPosition === "right" && icon && (
          <div
            className={clsx(
              "p-2 rounded-full inset-shadow-sm group-hover:bg-opacity-70 transition-all duration-300",
              finalIconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </GradientButton>
  );
}
