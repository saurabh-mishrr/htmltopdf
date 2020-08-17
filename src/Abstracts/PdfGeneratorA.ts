import axios from "axios";
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
import PdfGeneratorI from "../Interfaces/PdfGeneratorI";
import { log } from "../Modules/Logging";

export default abstract class PdfGeneratorA implements PdfGeneratorI {
  readonly storagePath: string | undefined = process.env.STORAGE_PATH;
  #fileName: string;
  #headerFile: string;
  #footerFile: string;
  #contentFile: string;
  // requestBodyObj: any;
  requestBodyObj: {
    html: string;
    header: string;
    footer: string;
    dpi?: number;
    filename: string;
    margin?: object;
    page_size: string;
    margin_top?: string | number;
    margin_bottom?: string | number;
    margin_left?: string | number;
    margin_right?: string | number;
    "margin-top"?: string | number;
    "margin-bottom"?: string | number;
    "margin-left"?: string | number;
    "margin-right"?: string | number;
  };

  constructor(requestBody: any) {
    this.#fileName = requestBody.body.filename;
    this.#headerFile = path.resolve(
      this.storagePath + this.#fileName + "_header.html"
    );
    this.#footerFile = path.resolve(
      this.storagePath + this.#fileName + "_footer.html"
    );
    this.#contentFile = path.resolve(
      this.storagePath + this.#fileName + "_body.html"
    );
    this.requestBodyObj = requestBody.body;
  }

  abstract generatePdf(): Promise<string | Buffer | object>;
  // what does this function do?
  // Take html input
  // Check if it is valid html
  // Add doctype if does not exist
  // replace images to include base64 links
  //
  sanitizeHeaderFooter = async (content: string): Promise<string> => {
    if (content === "" || typeof content === undefined) {
      return "";
    }
    try {
      let $ = cheerio.load(content);
      let sanitizedContent: string = "";

      let isBodyTagExists = $("body").html();
      sanitizedContent = await this.wrapAroundDiv($.html());

      if (isBodyTagExists !== null || isBodyTagExists !== "") {
        sanitizedContent = await this.wrapAroundDiv(isBodyTagExists);
      }

      $ = await cheerio.load(sanitizedContent);

      // let awaitResponseObj: object = {};
      //let's get all the img tag's src available in sent content.
      // let allImg = $(".html_container").find("img");
      // console.log(allImg);
      let promises: Array<Promise<boolean>> = [];
      $(".html_container")
        .find("img")
        .each(function (this: CheerioElement) {
          let element = $(this);
          let promise = async (element: any) => {
            let extension = element.attr("src").split(".").pop();
            let image = await axios.get(element.attr("src"), {
              responseType: "arraybuffer",
            });

            return $(element).attr(
              "src",
              `data:image/${extension};base64,` +
                Buffer.from(image.data).toString("base64")
            );
          };

          promises.push(promise(element));
        });

      await Promise.all(promises);
      return $(".html_container").html();
    } catch (e) {
      console.log("Inside SanitizeHeaderFooter", e);
    }
    return "";
  };

  /**
   * send html content as input param to this function and it will return string with wrapped div content.
   * @param content
   */
  wrapAroundDiv = async (content: string): Promise<string> => {
    return '<div class="html_container">' + content + "</div>";
  };

  /**
   * generates html files in the system.
   *
   * @param contentHtml string
   * @param headerHtml string
   * @param footerHtml string
   * @author Saurabh.Mishra
   */
  generateHtml = async (
    contentHtml: string,
    headerHtml?: string,
    footerHtml?: string
  ) => {
    if (headerHtml !== "") {
      await fs.writeFile(this.#headerFile, headerHtml, function (err: Error) {
        if (err) console.error(err);
      });
    }
    if (footerHtml !== "") {
      await fs.writeFile(this.#footerFile, footerHtml, function (err: Error) {
        if (err) console.error(err);
      });
    }

    if (contentHtml !== "") {
      await fs.writeFile(this.#contentFile, contentHtml, function (err: Error) {
        if (err) console.error(err);
      });
    }
  };

  get headerFile(): string {
    return this.#headerFile;
  }

  get footerFile(): string {
    return this.#footerFile;
  }

  get contentFile(): string {
    return this.#contentFile;
  }
}
