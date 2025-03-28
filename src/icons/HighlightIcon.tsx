import React from 'react';

interface HighlightIconProps {
  color?: string;
  width?: string;
}

const HighlightIcon: React.FC<HighlightIconProps> = ({
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
    {/* This path draws a simple highlighter-like shape */}
    <path
      d="M4 3H14L18 7V9L8 9L4 5V3Z"
      fill={color}
    />
  </svg>
);

export default HighlightIcon;
