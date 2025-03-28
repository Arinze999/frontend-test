import React from 'react';

interface SignIconProps {
  color?: string;
  width?: string;
}

const SignIcon: React.FC<SignIconProps> = ({
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
    {/* A creative squiggly line to represent a signature */}
    <path
      d="M3 14c2 2 4-2 7 0s4 2 7 0"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SignIcon;
