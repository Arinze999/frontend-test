import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import Buton from '../../Buton';
import { usePdf } from '../../../contexts/PdfContext';
import Swal from 'sweetalert2';

const FileUploader: React.FC = () => {
  const { file, setFile } = usePdf(); // Using context to store the file
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        Swal.fire({
          title: 'Uploaded!',
          text: 'PDF is ready for work',
          icon: 'success',
        });
      } else {
        alert('Please select a valid PDF file.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        Swal.fire({
          title: 'Uploaded!',
          text: 'PDF is ready for work',
          icon: 'success',
        });
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  };

  return (
    <Container>
      <Buton onClick={handleButtonClick}>Select PDF</Buton>
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <DropArea
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          borderColor: dragOver ? '#0070f3' : '#ccc',
          backgroundColor: dragOver ? '#e6f7ff' : '#fafafa',
        }}
      >
        {file ? (
          <div>
            <p>Working On:</p>
            <strong>{file.name}</strong>
          </div>
        ) : (
          <div>
            <p>
              Drag and drop your PDF here, or click "Select PDF" to choose a
              file.
            </p>
          </div>
        )}
      </DropArea>
    </Container>
  );
};

export default FileUploader;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const DropArea = styled.div`
  width: 100%;
  max-width: 600px;
  height: 30px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  color: #333;
  text-align: center;
  padding: 20px;
  transition: border-color 0.2s ease, background-color 0.2s ease;
`;
