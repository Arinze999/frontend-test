// utils/exportPdf.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Annotation } from '../app/models/Anotation';

/**
 * Convert annotations from your viewer (top‑left origin) to PDF‑Lib coordinates.
 * Assuming annotation.top is measured from the top of the page.
 */
function convertYCoordinate(
  pageHeight: number,
  annotationTop: number,
  annotationHeight: number
) {
  // PDF-Lib's origin is bottom-left.
  return pageHeight - annotationTop - annotationHeight;
}

// Helper to convert hex color string to PDF-Lib rgb object.
function hexToRgb(hex: string, opacity: number = 1) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return rgb(r / 255, g / 255, b / 255);
}

export async function exportAnnotatedPDF(
  originalPdfBytes: Uint8Array,
  annotations: Annotation[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Process each annotation
  for (const annotation of annotations) {
    const pageIndex = annotation.page - 1;
    const page = pdfDoc.getPage(pageIndex);
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const y = convertYCoordinate(pageHeight, annotation.top, annotation.height);

    if (annotation.type === 'highlight') {
      // Use the stored color if available; otherwise, default to yellow.
      const colorObj = annotation.color
        ? hexToRgb(annotation.color, 0.5)
        : rgb(1, 1, 0);
      page.drawRectangle({
        x: annotation.left,
        y,
        width: annotation.width,
        height: annotation.height,
        color: colorObj,
        opacity: 0.5,
      });
    } else if (annotation.type === 'underline') {
      // Use the stored color if available; otherwise, default to blue.
      const colorObj = annotation.color
        ? hexToRgb(annotation.color)
        : rgb(0, 0, 1);
      page.drawLine({
        start: { x: annotation.left, y },
        end: { x: annotation.left + annotation.width, y },
        thickness: 2,
        color: colorObj,
      });
    } else if (annotation.type === 'comment') {
      if (annotation.content) {
        const defaultFontSize = 12;
        // Add some padding inside the rectangle.
        const padding = 4;
        const availableWidth = annotation.width - padding;
        // Measure the width of the text at the default font size.
        const textWidth = helveticaFont.widthOfTextAtSize(
          annotation.content,
          defaultFontSize
        );
        // Calculate a scale factor to make the text fit the available width.
        const scaleWidth = availableWidth / textWidth;

        // For height, assume a line height of roughly 1.2 * fontSize.
        const availableHeight = annotation.height - padding;
        const scaleHeight = availableHeight / (defaultFontSize * 1.2);

        // Use the smaller scale so the text fits both width and height.
        const finalScale = Math.min(scaleWidth, scaleHeight, 1);
        const finalFontSize = defaultFontSize * finalScale;

        // Adjust the y position so the text appears inside the box (with a small top padding).
        page.drawText(annotation.content, {
          x: annotation.left + 2, // 2px left padding
          y: y + annotation.height - finalFontSize - 2, // top padding of 2px
          size: finalFontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    } else if (annotation.type === 'signature') {
      if (annotation.content) {
        const pngImage = await pdfDoc.embedPng(annotation.content);
        const imgWidth = pngImage.width;
        const imgHeight = pngImage.height;
        // Calculate a scale factor to ensure the image fits within the annotation rectangle.
        const scale = Math.min(
          annotation.width / imgWidth,
          annotation.height / imgHeight
        );
        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;
        // Optionally center the image inside the annotation rectangle.
        const offsetX = annotation.left + (annotation.width - finalWidth) / 2;
        const offsetY =
          convertYCoordinate(pageHeight, annotation.top, annotation.height) +
          (annotation.height - finalHeight) / 2;
        page.drawImage(pngImage, {
          x: offsetX,
          y: offsetY,
          width: finalWidth,
          height: finalHeight,
        });
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}
