// components/PdfPageWithAnnotation.tsx
import React, { useState, MouseEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { Annotation, AnnotationType } from '../../../models/Anotation';
import { v4 as uuidv4 } from 'uuid';
import { usePdf } from '@/app/contexts/PdfContext';
import SignatureCanvas from 'react-signature-canvas';
import Buton from '../../Buton';
import Swal from 'sweetalert2';

const PageContainer = styled.div`
  position: relative;
`;

interface AnnotationOverlayProps {
  left: number;
  top: number;
  width: number;
  height: number;
  type: AnnotationType;
  color?: string;
}

const AnnotationOverlay = styled.div<AnnotationOverlayProps>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  pointer-events: none;
  ${({ type, color }) =>
    type === 'highlight'
      ? `
        background-color: ${
          color
            ? `rgba(${hexToRgbString(color)}, 0.3)`
            : 'rgba(255, 255, 0, 0.3)'
        };
        border: none;
      `
      : type === 'underline'
      ? `
        border-bottom: 2px solid ${color ? color : 'blue'};
      `
      : type === 'comment'
      ? `
        border: 2px dashed green;
      `
      : `
        border: 2px dashed red;
      `}
`;

// Helper function to convert hex (e.g., "#FF0000") to an "r, g, b" string.
function hexToRgbString(hex: string) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

const CommentTextOverlay = styled.div<{
  left: number;
  top: number;
  width: number;
  height: number;
}>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px;
  z-index: 1000;
  font-size: 12px;
  overflow: hidden;
  word-wrap: break-word;
`;

const CommentInputContainer = styled.div<{ left: number; top: number }>`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  z-index: 1000;
  background: #fff;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;

  & > div {
    display: flex;
    gap: 1rem;

    & > button:nth-of-type(2) {
      background: darkred;
    }
  }
`;

interface PdfPageWithAnnotationProps {
  children: React.ReactNode;
  annotationType: AnnotationType;
  pageNumber: number;
  highlightColor: string;
  underlineColor: string;
}

const PdfPageWithAnnotation: React.FC<PdfPageWithAnnotationProps> = ({
  children,
  annotationType,
  pageNumber,
  highlightColor,
  underlineColor,
}) => {
  const { addAnnotation, annotations } = usePdf();
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<Annotation | null>(null);

  // For comment annotations
  const [pendingComment, setPendingComment] = useState<Annotation | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  // For signature annotations (if needed)
  const [pendingSignature, setPendingSignature] = useState<Annotation | null>(
    null
  );

  interface SignatureCanvasInstance {
    clear: () => void;
    isEmpty: () => boolean;
    getTrimmedCanvas: () => HTMLCanvasElement;
    getCanvas: () => HTMLCanvasElement;
  }

  const sigCanvasRef = useRef<SignatureCanvasInstance | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (annotationType === 'signature' && pendingSignature) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!startPos) return;
    if (annotationType === 'signature' && pendingSignature) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = Math.min(x, startPos.x);
    const top = Math.min(y, startPos.y);
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);
    setCurrentRect({
      id: uuidv4(),
      type: annotationType,
      page: pageNumber,
      left,
      top,
      width,
      height,
      color:
        annotationType === 'highlight'
          ? highlightColor
          : annotationType === 'underline'
          ? underlineColor
          : undefined,
    });
  };

  const handleMouseUp = () => {
    if (currentRect) {
      if (annotationType === 'comment') {
        setPendingComment(currentRect);
        setCommentText('');
      } else if (annotationType === 'signature') {
        setPendingSignature(currentRect);
      } else {
        addAnnotation(currentRect);
      }
      setCurrentRect(null);
    }
    setStartPos(null);
  };

  const saveComment = () => {
    if (pendingComment) {
      const newAnnotation: Annotation = {
        ...pendingComment,
        content: commentText,
      };
      addAnnotation(newAnnotation);
      setPendingComment(null);
      setCommentText('');
    }
  };

  const cancelComment = () => {
    setPendingComment(null);
    setCommentText('');
  };

  const saveSignature = () => {
    if (
      pendingSignature &&
      sigCanvasRef.current &&
      !sigCanvasRef.current.isEmpty()
    ) {
      // Check if getTrimmedCanvas is available; if not, fallback to getCanvas (if available)
      const getCanvasFn =
        typeof sigCanvasRef.current.getTrimmedCanvas === 'function'
          ? sigCanvasRef.current.getTrimmedCanvas
          : sigCanvasRef.current.getCanvas;

      if (getCanvasFn) {
        const trimmedCanvas = getCanvasFn.call(sigCanvasRef.current);
        const dataUrl = trimmedCanvas.toDataURL('image/png');
        const newAnnotation: Annotation = {
          ...pendingSignature,
          content: dataUrl,
        };
        addAnnotation(newAnnotation);
        setPendingSignature(null);
      } else {
        console.error(
          'Signature canvas instance does not have getTrimmedCanvas or getCanvas method.'
        );
        Swal.fire({
          title: 'Error',
          text: 'Error saving signature',
          icon: 'error',
        });
      }
    }
  };

  const cancelSignature = () => {
    setPendingSignature(null);
  };

  return (
    <PageContainer
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}

      {/* Render temporary annotation while drawing */}
      {annotationType !== 'signature' && currentRect && (
        <AnnotationOverlay
          left={currentRect.left}
          top={currentRect.top}
          width={currentRect.width}
          height={currentRect.height}
          type={annotationType}
          color={currentRect.color}
        />
      )}
      {annotationType === 'signature' && !pendingSignature && currentRect && (
        <AnnotationOverlay
          left={currentRect.left}
          top={currentRect.top}
          width={currentRect.width}
          height={currentRect.height}
          type={annotationType}
        />
      )}

      {/* Render persistent annotations for the current page */}
      {annotations
        .filter((ann) => ann.page === pageNumber)
        .map((ann) => (
          <React.Fragment key={ann.id}>
            <AnnotationOverlay
              left={ann.left}
              top={ann.top}
              width={ann.width}
              height={ann.height}
              type={ann.type}
              color={ann.color}
            />
            {ann.type === 'comment' && ann.content && (
              <CommentTextOverlay
                left={ann.left}
                top={ann.top}
                width={ann.width}
                height={ann.height}
              >
                {ann.content}
              </CommentTextOverlay>
            )}
            {ann.type === 'signature' && ann.content && (
              <img
                src={ann.content}
                alt="signature"
                style={{
                  position: 'absolute',
                  left: ann.left,
                  top: ann.top,
                  width: ann.width,
                  height: ann.height,
                  objectFit: 'contain',
                  zIndex: 1000,
                }}
              />
            )}
          </React.Fragment>
        ))}

      {/* Render comment input overlay if a comment annotation is pending */}
      {pendingComment && (
        <CommentInputContainer
          left={pendingComment.left}
          top={pendingComment.top}
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Enter comment..."
            rows={3}
            style={{ width: '200px' }}
          />
          <div>
            <Buton onClick={saveComment}>Save</Buton>
            <Buton onClick={cancelComment}>Cancel</Buton>
          </div>
        </CommentInputContainer>
      )}

      {/* Render signature pad overlay if a signature annotation is pending */}
      {pendingSignature && (
        <div
          style={{
            position: 'absolute',
            left: pendingSignature.left,
            top: pendingSignature.top,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ccc',
          }}
        >
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            minWidth={1}
            maxWidth={1}
            canvasProps={{
              width: pendingSignature.width,
              height: pendingSignature.height,
              style: { display: 'block' },
            }}
          />
          <Sign>
            <Buton onClick={saveSignature}>Save</Buton>
            <Buton onClick={cancelSignature}>Cancel</Buton>
          </Sign>
        </div>
      )}
    </PageContainer>
  );
};

export default PdfPageWithAnnotation;

const Sign = styled.div`
  display: flex;
  gap: 1rem;

  & > button:nth-of-type(2) {
    background: darkred;
  }
`;
