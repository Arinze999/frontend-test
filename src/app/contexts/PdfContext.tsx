// contexts/PdfContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Annotation } from '../models/Anotation';

interface PdfContextProps {
  file: File | null;
  setFile: (file: File | null) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (id: string) => void;
  clearContext: () => void;
}

const PdfContext = createContext<PdfContextProps | undefined>(undefined);

export const PdfProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const addAnnotation = (annotation: Annotation) => {
    console.log('Adding annotation:', annotation);
    setAnnotations((prev) => [...prev, annotation]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id));
  };

  const clearContext = () => {
    setFile(null);
    setAnnotations([]);
  };

  return (
    <PdfContext.Provider
      value={{
        file,
        setFile,
        annotations,
        addAnnotation,
        removeAnnotation,
        clearContext,
      }}
    >
      {children}
    </PdfContext.Provider>
  );
};

export const usePdf = (): PdfContextProps => {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error('usePdf must be used within a PdfProvider');
  }
  return context;
};
