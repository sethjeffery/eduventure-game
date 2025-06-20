import React from "react";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundWrapper({
  children,
  className = "",
}: BackgroundWrapperProps) {
  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative ${className}`}
      style={{
        backgroundImage: `url('/backgrounds/default.webp')`,
      }}
    >
      {children}
    </div>
  );
}
