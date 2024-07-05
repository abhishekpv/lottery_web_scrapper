const extractFileData = require("./extractFileData");
const downloadPdf = require("./pdfDownload");

const url =
  "https://result.keralalotteries.com/viewlotisresult.php?drawserial=";

const findWinner = async (lottery, pdf) => {
  if (!pdf) {
    return {
      success: false,
      error: "No pdf id provided.",
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
