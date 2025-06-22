import React from "react";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const colorClasses = {
  purple: "bg-purple-600/80 backdrop-blur-md text-white",
  green: "bg-green-600/80 backdrop-blur-md text-white",
  red: "bg-red-600/80 backdrop-blur-md text-white",
  blue: "bg-blue-600/80 backdrop-blur-md text-white",
};

// Base content panel - main content areas
export function ContentPanel({ children, className = "" }: PanelProps) {
  const baseClasses = "rounded-xl p-8 shadow-2xl bg-frosted-glass";

  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}

// Menu card panel - for menu screens
export function MenuCard({ children, className = "" }: PanelProps) {
  return (
    <ContentPanel className={`max-w-2xl ${className}`}>{children}</ContentPanel>
  );
}

// Status panel - for game status and info sections
export function StatusPanel({
  children,
  className = "",
}: Omit<PanelProps, "variant" | "color">) {
  return (
    <div className={`bg-glass rounded-lg p-4 text-white ${className}`}>
      {children}
    </div>
  );
}

// Colored panel - for special states like game over
export function ColoredPanel({
  children,
  className = "",
  color = "purple",
}: PanelProps & { color?: keyof typeof colorClasses }) {
  const colorClass = colorClasses[color];
  const baseClasses =
    "rounded-xl p-8 border border-white border-opacity-20 shadow-2xl";

  return (
    <div className={`${baseClasses} ${colorClass} ${className}`}>
      {children}
    </div>
  );
}
