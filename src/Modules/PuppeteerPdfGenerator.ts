import puppeteer from "puppeteer";
const path = require("path");
const fs = require("fs");
import PdfGeneratorA from "../Abstracts/PdfGeneratorA";
import { log } from "./Logging";

export default class PuppeteerPdfGenerator extends PdfGeneratorA {
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
    let headerHtml: string = await this.sanitizeHeaderFooter(
      this.requestBodyObj.header
    );

    let bodyHtml: string = this.requestBodyObj.html;
    let footerHtml: string = await this.sanitizeHeaderFooter(
      this.requestBodyObj.footer
    );

    if (process.env.ENV == "development") {
      //@important: do not comment or remove below line, it generates html files in the system.
      await this.generateHtml(bodyHtml, headerHtml, footerHtml);
    }

    let browser: any;
    let pdfOutput: Promise<Buffer | string>;
    try {
      let pdfDefaultOptions: object = {
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        margin: { top: "100px", bottom: "200px" },
        //pageRanges: "1",
      };
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
      let pdfOptions: object = { ...pdfDefaultOptions, ...requestPdfParams };

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--headless", "--disable-gpu"],
      });
      let page: any = await browser.newPage();
      //await page.emulateMediaType("print");
      await page.setContent(bodyHtml, { waitUntil: "networkidle2" });
      pdfOutput = await page.pdf(pdfOptions);
      return pdfOutput;
    } catch (e) {
      console.error("Inside generatePdf ", e);
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
    return "";
  }
}
