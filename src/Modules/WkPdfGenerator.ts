const path = require("path");
const fs = require("fs");
const wkhtmltopdf = require("wkhtmltopdf");
import PdfGeneratorA from "../Abstracts/PdfGeneratorA";
import { log } from "./Logging";

export default class WkPdfGenerator extends PdfGeneratorA {
  constructor(requestBody: object) {
    super(requestBody);
  }

  /**
   * generates pdf from html.
   *
   * @param requestBody Request
   * @author Saurabh.Mishra
   */
  async generatePdf() {
    let headerHtml: string = this.requestBodyObj.header;
    let bodyHtml: string = this.requestBodyObj.html;
    let footerHtml: string = this.requestBodyObj.footer;
    if (process.env.ENV == "development") {
      //@important: do not comment or remove below line, it generates html files in the system.
      await this.generateHtml(bodyHtml, headerHtml, footerHtml);
    }

    let pdfOutput: Promise<Buffer | string>;
    try {
      let downloadFileName = path.resolve(
        process.env.STORAGE_PATH + this.requestBodyObj.filename + ".pdf"
      );

      let requestPdfParams: object = {
        format: this.requestBodyObj.page_size,
        path: downloadFileName,
        // margin: {top: this.requestBodyObj.margin_top, bottom: this.requestBodyObj.margin_bottom},
        headerTemplate: headerHtml,
        footerTemplate: footerHtml,
      };

      pdfOutput = await wkhtmltopdf(this.requestBodyObj.html, {
        output: downloadFileName,
        dpi: this.requestBodyObj.dpi ?? 180,
        headerHtml: headerHtml,
        footerHtml: footerHtml,
        marginTop: this.requestBodyObj.margin_top ?? 10,
        marginBottom: this.requestBodyObj.margin_bottom ?? 10,
        pageSize: this.requestBodyObj.page_size,
      });

      return pdfOutput;
    } catch (e) {
      console.error("Inside generatePdf ", e);
    }
    return "";
  }
}
