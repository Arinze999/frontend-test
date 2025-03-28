'use client';

import styled from '@emotion/styled';
import UploadDoc from './components/pdf/selector/UploadDoc';
import { PdfProvider } from './contexts/PdfContext';
import ViewPdf from './components/pdf/viewer/ViewPdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export default function Home() {
  return (
    <PdfProvider>
      <Div className="container">
        <UploadDoc />
        <ViewPdf />
      </Div>
    </PdfProvider>
  );
}

const Div = styled.div`
  display: flex;
  align-items:center;
  flex-direction: column;
  gap: 2rem;
`;
