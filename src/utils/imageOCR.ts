import Tesseract from 'tesseract.js';

export class ImageOCR {
  static async extractText(file: File): Promise<string> {
    const imageUrl = URL.createObjectURL(file);
    try {
      const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');
      return text;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }
}