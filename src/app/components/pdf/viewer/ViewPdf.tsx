// pages/ViewPdf.tsx
import dynamic from 'next/dynamic';
import { usePdf } from '@/app/contexts/PdfContext';
import { useState } from 'react';
import AnnotationToolbar from '../editors/AnotationToolbar';
import ColorPicker from '@/app/components/ColorPicker';
import AnnotationList from '../editors/AnotaionList';
import ExportPdfButton from '../../ExportButton';
import styled from '@emotion/styled';

// Dynamically import the PdfViewer component, disabling SSR.
const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

const ViewPdf = () => {
  const { file } = usePdf();
  const [selectedType, setSelectedType] = useState<
    'highlight' | 'underline' | 'comment' | 'signature'
  >('highlight');
  // Separate states for highlight and underline colors.
  const [highlightColor, setHighlightColor] = useState<string>('#FFFF00'); // Default yellow.
  const [underlineColor, setUnderlineColor] = useState<string>('#0000FF'); // Default blue.

  if (!file) {
    return <p>No PDF selected. Please upload a PDF file first.</p>;
  }

  // Render the ColorPicker for highlight or underline based on selected type.
  const renderColorPicker = () => {
    if (selectedType === 'highlight') {
      return (
        <ColorPicker
          selectedColor={highlightColor}
          onColorSelect={setHighlightColor}
        />
      );
    } else if (selectedType === 'underline') {
      return (
        <ColorPicker
          selectedColor={underlineColor}
          onColorSelect={setUnderlineColor}
        />
      );
    }
    return null;
  };

  return (
    <Container>
      <AnnotationToolbar
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />
      {renderColorPicker()}
      <p>Info: click and drag on the PDF to select sections to annotate</p>
      <small>You can delete annotations at the bottom of the PDF</small>
      <PdfViewer
        file={file}
        selectedType={selectedType}
        highlightColor={highlightColor}
        underlineColor={underlineColor}
      />
      <AnnotationList />
      <ExportPdfButton />
    </Container>
  );
};

export default ViewPdf;

const Container = styled.div`
  width: 100%;

  & > p {
    color: blue;
    font-size: 14px;
  }

  & > small {
    color: red;
  }
`;
