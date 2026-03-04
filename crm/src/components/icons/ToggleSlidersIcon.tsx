import React from "react";
import "./ToggleSlidersIcon.module.css";

interface ToggleSlidersIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const ToggleSlidersIcon: React.FC<ToggleSlidersIconProps> = ({
  width = 32,
  height = 32,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`toggle-sliders-icon ${className}`}
    >
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {/* Верхний переключатель */}
        <line x1="8" y1="14" x2="40" y2="14" />
        <circle cx="30" cy="14" r="5" fill="currentColor" />

        {/* Средний переключатель */}
        <line x1="8" y1="24" x2="40" y2="24" />
        <circle cx="18" cy="24" r="5" fill="currentColor" />

        {/* Нижний переключатель */}
        <line x1="8" y1="34" x2="40" y2="34" />
        <circle cx="35" cy="34" r="5" fill="currentColor" />
      </g>
    </svg>
  );
};

export default ToggleSlidersIcon;
