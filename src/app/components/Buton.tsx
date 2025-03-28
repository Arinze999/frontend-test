import React from 'react';

import styled from '@emotion/styled';

interface IButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const Buton: React.FC<IButtonProps> = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default Buton;

const Button = styled.button`
  background-color: rgb(6, 81, 167);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  :hover {
    background-color: #043873;
  }
`;
