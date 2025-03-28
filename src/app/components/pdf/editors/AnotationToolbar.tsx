// components/AnnotationToolbar.tsx
import React from 'react';
import styled from '@emotion/styled';
import { AnnotationType } from '@/app/models/Anotation';
import HighlightIcon from '@/icons/HighlightIcon';
import UnderlineIcon from '@/icons/UnderlineIcon';
import CommentIcon from '@/icons/CommentIcon';
import SignIcon from '@/icons/SignIcon';

interface AnnotationToolbarProps {
  selectedType: AnnotationType;
  onSelectType: (type: AnnotationType) => void;
}

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    gap: 10px;
  }
`;


const ToolbarButton = styled.p<{ selected: boolean }>`
  padding: 8px 12px;
  border: none;
  background: none;
  color: ${({ selected }) => (selected ? 'black' : 'gray')};
  cursor: pointer;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: start;
  gap:5px;
`;

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  selectedType,
  onSelectType,
}) => {
  const types: AnnotationType[] = [
    'highlight',
    'underline',
    'comment',
    'signature',
  ];

  return (
    <ToolbarContainer>
      {types.map((type) => (
        <ToolbarButton
          key={type}
          selected={selectedType === type}
          onClick={() => onSelectType(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
          {type === 'highlight' && <HighlightIcon width='20px'/>}
          {type === 'underline' && <UnderlineIcon width='20px'/>}
          {type === 'comment' && <CommentIcon width='20px'/>}
          {type === 'signature' && <SignIcon width='20px'/>}
        </ToolbarButton>
      ))}
    </ToolbarContainer>
  );
};

export default AnnotationToolbar;
