import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import {Request, Response} from "express";

export const convert = async (req: Request, res: Response) => {
    let requestBody:any = req.body;
    const pdfGenerator = new PdfGenerator();
    const pdf = await pdfGenerator.generatePdf(requestBody);
    const downloadFileName = requestBody.filename+".pdf";
    if (pdf !== null) {
        if (requestBody.getFileContentOnly) {
            res.type("application/pdf");
            res.attachment(downloadFileName);
            return res.send(pdf);
        }
        return res.send("/download/" + downloadFileName);
    }
}

class PdfGenerator {
    async generatePdf(requestBody: any) {
        const headerHtml = requestBody.header;
        const bodyHtml = requestBody.html;
        const footerHtml = requestBody.footer;
        let browser = null;
        let pdf = null;
        let generatedHtmlFile = path.resolve('./Storage/' + requestBody.filename + '.html');
        console.log(generatedHtmlFile);
        let generatedScreenshotFile = path.resolve('./Storage/' + requestBody.filename + '.png');
        await fs.writeFile(generatedHtmlFile, bodyHtml, 'utf8', function (err) {
            if (!err) console.log('File generated');
        });
        let pdfDefaultOptions = {
            format: "A4",
            printBackground: true,
            displayHeaderFooter: true,
            margin: {top: "100px", bottom: "200px"},
            pageRanges: "1"
        }
        let downloadFileName = path.resolve('./Storage/' + requestBody.filename + ".pdf");

        let requestPdfParams = {
            format: requestBody.page_size,
            path: downloadFileName,
            margin: {top: requestBody.margin_top, bottom: requestBody.margin_bottom},
            headerTemplate: headerHtml,
            footerTemplate: footerHtml
        }

        let pdfOptions = {...pdfDefaultOptions, ...requestPdfParams};
        console.log(pdfOptions);
        try {


            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    // '--disable-setuid-sandbox',
                    '--headless',
                    '--disable-gpu',
                    // '--disable-dev-shm-usage'
                ],
                // executablePath: process.env.CHROME_BIN || null
            });


            let page = await browser.newPage();

            await page.goto('file://' + generatedHtmlFile, {'waitUntil': 'networkidle0'});
            await page.screenshot({path: generatedScreenshotFile, fullPage: true});

            pdf = await page.pdf(pdfOptions);

        } catch (error) {

            console.log(error);
        } finally {
            if (browser !== null) {

                await browser.close();
            }
        }


        return Promise.resolve(pdf);

    }

    private async sanitizeHeaderFooter(headerContent:string) {

    }
}

