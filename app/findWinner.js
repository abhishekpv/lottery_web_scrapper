const extractFileData = require("./extractFileData");
const downloadPdf = require("./pdfDownload");

const url =
  "https://result.keralalotteries.com/viewlotisresult.php?drawserial=";

const findWinner = async (lottery, pdf) => {
  if (!lottery || !pdf) {
    let message = "";
    if (!pdf) {
      message = "No pdf id provided.";
    } else {
      message = "No lottery no provided.";
    }
    return {
      success: false,
      error: message,
    };
  }
  const downloadedPdf = await downloadPdf(url + pdf);
  if (!downloadedPdf) {
    return {
      success: false,
      error: "No pdf found.",
    };
  }
  const result = await extractFileData(downloadedPdf, lottery);
  return {
    success: true,
    data: result,
  };
};

module.exports = findWinner;
