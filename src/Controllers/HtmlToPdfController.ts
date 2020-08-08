import { Request, Response } from "express";
import { generatePdf } from "../Modules/PdfGenerator";
export async function convert(
  request: Request,
  response: Response
): Promise<string | object> {
  const requestBody = request.body;
  const pdf = await generatePdf(requestBody);
  const downloadFileName = requestBody.filename + ".pdf";
  if (pdf !== null) {
    if (requestBody.getFileContentOnly) {
      response.type("application/pdf");
      response.attachment(downloadFileName);
      return response.send(pdf);
    }
    return response.send("/download/" + downloadFileName);
  }
  return response.send("Some error occurred!");
}
