import React from 'react';

interface UnderlineIconProps {
  color?: string;
  width?: string;
}

const UnderlineIcon: React.FC<UnderlineIconProps> = ({
  color = 'currentColor',
  width = '24px',
}) => (
  <svg
    width={width}
    height={width}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* A U-shape to represent text with an underline, plus an underline line */}
    <path
      d="M6 4v8a6 6 0 0 0 12 0V4"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="4"
      y1="20"
      x2="20"
      y2="20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default UnderlineIcon;
