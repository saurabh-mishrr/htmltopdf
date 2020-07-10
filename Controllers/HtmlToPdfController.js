const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

exports.convert = async (req, res) => {
  
  logIt('Starts now...');
  let eventBody = req.body;
  let requestBody = (typeof eventBody == typeof 'string' ? JSON.parse(eventBody) : eventBody);
  logIt('Calling generatePdf function...');
  let pdf = await generatePdf(requestBody);
  logIt('generatePdf function ended...');
  const downloadFileName = requestBody.filename+".pdf";
  if (pdf !== null) {
    logIt('Preparing response...');
    if (requestBody.getFileContentOnly) {
      res.contentType("application/pdf");
      res.attachment(downloadFileName);
      return res.send(pdf);
    }
    return res.send("/download/" + downloadFileName);
    logIt('Ends now....');
  }
    
};


exports.downloadFile = (req, res) =>  {
  var file = req.params.file;
  var fileLocation = path.join('./Storage',file);
  fs.readFile(fileLocation, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
  // res.download(fileLocation, file);
}


async function generatePdf(requestBody) {
  const headerHtml = requestBody.header;
  const bodyHtml = requestBody.html;
  const footerHtml = requestBody.footer;
  let browser = null;
  let pdf = null;
  let generatedHtmlFile = path.resolve('./Storage/' + requestBody.filename + '.html');
  let generatedScreenshotFile = path.resolve('./Storage/' + requestBody.filename + '.png');
  await fs.writeFile(generatedHtmlFile, bodyHtml, 'utf8',function(err){
    if(!err) console.log('File generated');
  });
  let pdfDefaultOptions = {
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    margin: { top: "100px", bottom: "200px" },
    pageRanges: "1"
  }
  let downloadFileName = path.resolve('./Storage/'+requestBody.filename+".pdf");

  let requestPdfParams = {
    format: requestBody.page_size,
    path: downloadFileName,
    margin: {top: requestBody.margin_top, bottom: requestBody.margin_bottom},
    headerTemplate: headerHtml,
    footerTemplate: footerHtml
  }

  let pdfOptions =  {...pdfDefaultOptions, ...requestPdfParams};
  console.log(pdfOptions);
  try {

    logIt('Launching Chromium...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ],
      executablePath: process.env.CHROME_BIN || null
    });

    logIt('Starting new page...');
    let page = await browser.newPage();
    logIt('Setting up content...');
    await page.goto('file://'+generatedHtmlFile, { 'waitUntil': 'networkidle0' });
    await page.screenshot({path: generatedScreenshotFile, fullPage: true});
    logIt('Generating pdf page...');
    pdf = await page.pdf(pdfOptions);

  } catch (error) {
    logIt('Error received...');
    console.log(error);
  } finally {
    if (browser !== null) {
      logIt('Closing browser...');
      await browser.close();
    }
  }

  logIt('Returning Promise...');
  return Promise.resolve(pdf);

}

function logIt(msg) {
  console.log(msg);
}