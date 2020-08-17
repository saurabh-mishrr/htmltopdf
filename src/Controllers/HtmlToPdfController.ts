import { Request, Response } from "express";
import PdfGeneratorI from "../Interfaces/PdfGeneratorI";
import WkPdfGenerator from "../Modules/WkPdfGenerator";
import PuppeteerPdfGenerator from "../Modules/PuppeteerPdfGenerator";

type PdfRequest = {
  req: Request;
  res: Response;
  pdfGeneratorCall: PdfGeneratorI;
};
export default class HtmlToPdfController {
  puppeteerPdfConvert = async (request: Request, response: Response) => {
    try {
      return await this.getPdfContent({
        req: request,
        res: response,
        pdfGeneratorCall: new PuppeteerPdfGenerator(request),
      });
    } catch (err) {
      console.error("wkPdfConvert ", err);
    }
  };

  wkPdfConvert = async (request: Request, response: Response) => {
    try {
      return await this.getPdfContent({
        req: request,
        res: response,
        pdfGeneratorCall: new WkPdfGenerator(request),
      });
    } catch (err) {
      console.error("wkPdfConvert ", err);
    }
  };

  private getPdfContent = async (prop: PdfRequest) => {
    try {
      const requestBody = prop.req.body;
      const pdf = await prop.pdfGeneratorCall.generatePdf();
      const downloadFileName = requestBody.filename + ".pdf";
      if (pdf !== null) {
        if (requestBody.getFileContentOnly) {
          prop.res.type("application/pdf");
          prop.res.attachment(downloadFileName);
          return prop.res.send(pdf);
        }
        return prop.res.send("/download/" + downloadFileName);
      }
      return prop.res.send("Some error occurred!");
    } catch (err) {
      console.log("Inside getPdfContent");
      console.log("returnPdf ", err.message);
    }
  };
}
