const fs = require("fs/promises");
const { default: axios } = require("axios");

const downloadPdf = async (url) => {
  const downloadedPdf = await axios.get(url, {
    responseType: "arraybuffer",
  });
  if (downloadedPdf.data.length == 0) {
    return false;
  }
  const fileData = Buffer.from(downloadedPdf?.data, "binary");
  //   await fs.writeFile("./file.pdf", fileData);
  return fileData;
};

module.exports = downloadPdf;
