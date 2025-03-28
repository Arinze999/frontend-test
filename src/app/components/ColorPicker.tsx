// components/ColorPicker.tsx
import React from 'react';
import styled from '@emotion/styled';

const ColorsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
  width: 100%;
`;

const ColorSwatch = styled.div<{ color: string; selected: boolean }>`
  width: 34px;
  height: 10px;
  border: ${({ selected }) =>
    selected ? '1px solid black' : '2px solid transparent'};
  background-color: ${({ color }) => color};
  transform: ${({ selected }) =>
    selected ? 'translateY(-8px)' : 'translateY(0)'};
  transition: transform 0.3s ease;
  cursor: pointer;
`;

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  // 5 preset colors (yellow, red, green, blue, orange)
  const colors = ['#FFFF00', '#FF0000', '#00FF00', '#0000FF', '#FFA500'];

  return (
    <ColorsContainer>
      {colors.map((color) => (
        <ColorSwatch
          key={color}
          color={color}
          selected={selectedColor === color}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </ColorsContainer>
  );
};

export default ColorPicker;
