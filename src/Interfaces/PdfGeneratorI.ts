export default interface PdfGeneratorI {
  generatePdf(): Promise<string | object | Buffer>;
}
