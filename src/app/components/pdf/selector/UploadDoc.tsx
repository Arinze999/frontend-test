import React from 'react';
import Buton from '../../Buton';
import styled from '@emotion/styled';
import FileUploader from './FileUploader';

const UploadDoc = () => {
  return (
    <Container>
      <h3>Start with uploading a PDF file</h3>
      <FileUploader />
    </Container>
  );
};

export default UploadDoc;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > h3 {
    color: #043873;
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align:center;
  }
`;
