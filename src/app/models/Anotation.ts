export type AnnotationType =
  | 'highlight'
  | 'underline'
  | 'comment'
  | 'signature';

export interface Annotation {
  id: string; // Unique identifier for the annotation
  type: AnnotationType; // Type of the annotation
  page: number; // Page number in the PDF where the annotation is applied
  left: number; // X-coordinate (relative to the page)
  top: number; // Y-coordinate (relative to the page)
  width: number; // Width of the annotation area
  height: number; // Height of the annotation area
  color?: string; // Optional: Color of the annotation (e.g., for highlights)
  content?: string; // Optional: Text content for a comment or note
}
