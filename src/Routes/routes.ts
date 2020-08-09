import HtmlToPdfController from "../Controllers/HtmlToPdfController";
const htmlToPdfControllerObj = new HtmlToPdfController();

export function routes(app: any) {
  app.route("/convert").post(htmlToPdfControllerObj.puppeteerPdfConvert);
  app.route("/convert/wk").post(htmlToPdfControllerObj.wkPdfConvert);
}
