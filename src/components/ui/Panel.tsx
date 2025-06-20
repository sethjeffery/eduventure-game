import React from "react";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

// Base content panel - main content areas
export function ContentPanel({ children, className = "" }: PanelProps) {
  const baseClasses =
    "rounded-xl p-8 border border-white border-opacity-20 shadow-2xl bg-radial from-white to-transparent backdrop-blur-md backdrop-brightness-150";

  return <div className={`${baseClasses} ${className}`}>{children}</div>;
}

// Menu card panel - for menu screens
export function MenuCard({
  children,
  className = "",
}: Omit<PanelProps, "variant" | "color">) {
  return (
    <div
      className={`max-w-2xl w-full bg-radial from-white to-transparent backdrop-blur-md backdrop-brightness-150 rounded-xl p-8 border border-white border-opacity-20 shadow-2xl text-center relative z-10 ${className}`}
    >
      {children}
    </div>
  );
}

// Sidebar panel - for sidebar content
export function SidebarPanel({
  children,
  className = "",
}: Omit<PanelProps, "variant" | "color">) {
  return (
    <div
      className={`bg-radial from-white to-transparent backdrop-blur-md backdrop-brightness-150 rounded-lg p-4 border border-white border-opacity-20 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

// Status panel - for game status and info sections
export function StatusPanel({
  children,
  className = "",
}: Omit<PanelProps, "variant" | "color">) {
  return (
    <div
      className={`bg-radial from-white to-transparent backdrop-blur-md backdrop-brightness-150 rounded-lg p-4 border border-white border-opacity-20 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

// Colored panel - for special states like game over
export function ColoredPanel({
  children,
  className = "",
  color = "purple",
}: PanelProps) {
  const colorClasses = {
    purple: "bg-purple-600/80 backdrop-blur-md text-white",
    green: "bg-green-600/80 backdrop-blur-md text-white",
    red: "bg-red-600/80 backdrop-blur-md text-white",
    blue: "bg-blue-600/80 backdrop-blur-md text-white",
  };

  const baseClasses =
    "rounded-xl p-8 border border-white border-opacity-20 shadow-2xl";
  const colorClass =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

  return (
    <div className={`${baseClasses} ${colorClass} ${className}`}>
      {children}
    </div>
  );
}
