// components/ExportPdfButton.tsx
import React, { useState } from 'react';
import { usePdf } from '@/app/contexts/PdfContext';
import { exportAnnotatedPDF } from '@/utils.ts/exportPdf';
import { v4 as uuidv4 } from 'uuid';
import styled from '@emotion/styled';
import Buton from './Buton';
import Swal from 'sweetalert2';

const ExportPdfButton: React.FC = () => {
  // Destructure setFile to allow clearing the PDF after export.
  const { file, annotations, clearContext } = usePdf();
  // Generate a default file name like "annotatedPDF_ab12cd34"
  const defaultName = `annotatedPDF_${uuidv4().slice(0, 8)}`;
  const [fileName, setFileName] = useState(defaultName);

  const handleExport = async () => {
    if (!file) return;

    // Read the file as an ArrayBuffer
    const fileArrayBuffer = await file.arrayBuffer();
    const originalPdfBytes = new Uint8Array(fileArrayBuffer);
    const modifiedPdfBytes = await exportAnnotatedPDF(
      originalPdfBytes,
      annotations
    );

    // Create a Blob from the modified PDF bytes and trigger download
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Success!',
      text: 'PDF Exported',
      icon: 'success',
    }).then(() => {
      clearContext();
    });
  };

  return (
    <div style={{ marginTop: '20px', marginBottom: '4rem' }}>
      <Div>
        <label>Change file name:</label>
        <StyledInput
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
      </Div>
      <Buton onClick={handleExport}>Export Annotated PDF</Buton>
    </div>
  );
};

export default ExportPdfButton;

const StyledInput = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;
