import React from "react";

interface EduVentureIconProps {
  size?: number;
  className?: string;
}

export function EduVentureIcon({
  size = 32,
  className = "",
}: EduVentureIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="16" cy="16" r="16" fill="#7C3AED" />
      <circle cx="16" cy="16" r="14" fill="#6D28D9" />

      {/* Graduation Cap */}
      <rect x="12" y="14" width="8" height="2" rx="1" fill="#1F2937" />
      <rect x="8" y="12" width="16" height="3" rx="1.5" fill="#374151" />

      {/* Star accent */}
      <polygon
        points="16,8 18,13 24,13 20,17 22,23 16,19 10,23 12,17 8,13 14,13"
        fill="#FCD34D"
      />
    </svg>
  );
}
