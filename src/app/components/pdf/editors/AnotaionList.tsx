// components/AnnotationList.tsx
import React from 'react';
import styled from '@emotion/styled';
import { usePdf } from '@/app/contexts/PdfContext';

const AnnotationList: React.FC = () => {
  const { annotations, removeAnnotation } = usePdf();

  return (
    <div>
      <h3>Annotations</h3>
      <ListContainer>
        {annotations.length === 0 ? (
          <p>No annotations yet.</p>
        ) : (
          annotations.map((ann) => (
            <AnnotationItem key={ann.id}>
              <p>
                <strong>Type:</strong> {ann.type}
              </p>
              <p>
                <strong>Page:</strong> {ann.page}
              </p>
              {ann.color && (
                <div>
                  <strong>Color</strong> <Span color={ann.color}></Span>
                </div>
              )}
              {ann.content &&
                (ann.type === 'signature' ? (
                  <img
                    src={ann.content}
                    alt="Signature"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ) : (
                  <div>
                    <strong>Content</strong> <span>{ann.content}</span>
                  </div>
                ))}

              {/* <p>
              <strong>Position:</strong> {Math.round(ann.left)},{' '}
              {Math.round(ann.top)} – {Math.round(ann.width)}x
              {Math.round(ann.height)}
            </p> */}
              <button onClick={() => removeAnnotation(ann.id)}>Delete</button>
            </AnnotationItem>
          ))
        )}
      </ListContainer>
    </div>
  );
};

export default AnnotationList;

const ListContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  gap: 10px;
`;

const AnnotationItem = styled.div`
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;

  &:last-of-type {
    border-bottom: none;
  }

  button {
    margin-top: 5px;
    padding: 4px 8px;
    font-size: 0.8rem;
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
`;

const Span = styled.p<{ color: string | undefined }>`
  background: ${({ color }) => color || ''};
  width: 30px;
  height: 10px;
`;
