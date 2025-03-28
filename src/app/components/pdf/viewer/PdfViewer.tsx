// components/PdfViewer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from '@emotion/styled';
import PdfPageWithAnnotation from '../editors/PdfPageWithAnnotation';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  border: 1px solid gray;

  & > p {
    color: blue;
    font-size: 14px;
  }

  & > small {
    color: red;
  }
`;

interface PdfViewerProps {
  file: File | string;
  selectedType: 'highlight' | 'underline' | 'comment' | 'signature';
  highlightColor: string;
  underlineColor: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  selectedType,
  highlightColor,
  underlineColor,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  // Ref for the container to measure its width
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600); // default fallback

  useEffect(() => {
    if (window.innerWidth > 600) {
      // Not mobile, so don't run the width update logic.
      return;
    }

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <ViewerContainer ref={containerRef}>
      {/* <p>Info: click and drag on the PDF to select sections to annotate</p>
      <small>You can delete annotations at the bottom of the PDF</small> */}
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) =>
          console.error('Error while loading document!', error)
        }
      >
        {Array.from(new Array(numPages), (el, index) => (
          <PdfPageWithAnnotation
            key={`page_${index + 1}`}
            annotationType={selectedType}
            pageNumber={index + 1}
            highlightColor={highlightColor}
            underlineColor={underlineColor}
          >
            {/* Pass the containerWidth to the Page so it scales responsively */}
            <Page pageNumber={index + 1} width={containerWidth} />
          </PdfPageWithAnnotation>
        ))}
      </Document>
    </ViewerContainer>
  );
};

export default PdfViewer;
