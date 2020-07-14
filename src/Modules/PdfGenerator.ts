import { encode } from "node-base64-image";
import puppeteer from "puppeteer";

const cheerio = require("cheerio");
const path = require("path");
import axios from "axios";

export async function generatePdf(requestBody: any): Promise<string | Buffer> {
  let headerHtml: string = await sanitizeHeaderFooter(requestBody.header);
  let bodyHtml: string = requestBody.html;
  let footerHtml: string = await sanitizeHeaderFooter(requestBody.footer);

  let browser: any;
  let pdfOutput: Promise<Buffer | string>;
  try {
    let pdfDefaultOptions: object = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: "100px", bottom: "200px" },
      pageRanges: "1",
    };
    let downloadFileName = path.resolve(
      process.env.STORAGE_PATH + requestBody.filename + ".pdf"
    );
    let requestPdfParams: object = {
      format: requestBody.page_size,
      path: downloadFileName,
      // margin: {top: requestBody.margin_top, bottom: requestBody.margin_bottom},
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
    };
    let pdfOptions: object = { ...pdfDefaultOptions, ...requestPdfParams };

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--headless", "--disable-gpu"],
    });
    let page: any = await browser.newPage();
    await page.setContent(bodyHtml, { waitUntil: "networkidle2" });
    pdfOutput = await page.pdf(pdfOptions);
    return pdfOutput;
  } catch (e) {
    console.error(e);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  return "";
}

// what does this function do?
// Take html input
// Check if it is valid html
// Add doctype if does not exist
// replace images to include base64 links
//

async function sanitizeHeaderFooter(content: string): Promise<string> {
  if (content === "" || typeof content === undefined) {
    return "";
  }

  try {
    let $ = cheerio.load(content);
    let sanitizedContent: string = "";

    let isBodyTagExists = $("body").html();
    sanitizedContent = await wrapAroundDiv($.html());

    if (isBodyTagExists !== null || isBodyTagExists !== "") {
      sanitizedContent = await wrapAroundDiv(isBodyTagExists);
    }

    $ = await cheerio.load(sanitizedContent);

    // let awaitResponseObj: object = {};
    //let's get all the img tag's src available in sent content.
    // let allImg = $(".html_container").find("img");
    // console.log(allImg);

    console.log(1);

    var promises: Array<Promise<boolean>> = [];
    $(".html_container")
      .find("img")
      .each(function (this: CheerioElement) {
        let element = $(this);

        console.log(2);

        let promise = async (element: any) => {
          let extension = element.attr("src").split(".").pop();
          let image = await axios.get(element.attr("src"), {
            responseType: "arraybuffer",
          });

          console.log(3);

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
    console.log(e);
  }
  return "";
}

/**
 * send html content as input param to this function and it will return string with wrapped div content.
 * @param content
 */
async function wrapAroundDiv(content: string): Promise<string> {
  return '<div class="html_container">' + content + "</div>";
}
