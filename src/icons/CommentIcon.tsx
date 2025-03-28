import React from 'react';

interface CommentIconProps {
  color?: string;
  width?: string;
}

const CommentIcon: React.FC<CommentIconProps> = ({
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
    {/* A simple chat bubble icon */}
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CommentIcon;
