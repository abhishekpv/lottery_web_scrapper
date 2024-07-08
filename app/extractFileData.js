const PdfParse = require("pdf-parse");
const findLottery = require("./findLottery");

const categoryRegex =
  /\d+(st|nd|rd|th) Prize Rs\s*:\s*[\d,\/-]+|Cons Prize-Rs\s*:\s*[\d,\/-]+/g;
const secondaryCategoryRegex = /\d+(st|nd|rd|th) Prize-Rs\s*:\s*[\d,\/-]+/g;
const footerRegex = /Page.*?\n/g;
const lotteryRegex = /[a-zA-Z]+\s+\d+/g;

const formatData = (result, matches) => {
  const output = [];
  for (let i = 0; i < matches.length - 1; i++) {
    let startIndex = result.indexOf(matches[i]);
    if (startIndex === -1) return "";
    startIndex += matches[i].length;

    let endIndex = result.indexOf(matches[i + 1], startIndex);
    if (endIndex === -1) return "";

    output.push({
      title: matches[i],
      data: result.substring(startIndex, endIndex),
    });
  }

  output.push({
    title: matches[matches.length - 1],
    data: result.split(matches[matches.length - 1])[1],
  });
  return output;
};

const fetchMainPrize = (data) => {
  const result = data.split("NEAR BAKERY JUNCTION, THIRUVANANTHAPURAM")[1];
  const matches = result.match(categoryRegex);
  const output = formatData(result, matches);

  return output.map((item) => {
    return { ...item, data: item.data.match(lotteryRegex) };
  });
};

const fetchSecondaryPrize = (data) => {
  const result = data.split("The prize winners")[0];
  const matches = result.match(secondaryCategoryRegex);
  const output = formatData(result, matches);
  return output.map((item) => {
    const data = item.data.replace(/\n/g, "").trim();
    const splitData = [];
    for (let i = 0; i < data.length; i += 4) {
      splitData.push(data.substring(i, i + 4));
    }
    return { ...item, data: splitData };
  });
};

const parseDataFromText = (data) => {
  const categorisedData = data
    .replace(footerRegex, "")
    .split("FOR THE TICKETS ENDING WITH THE FOLLOWING NUMBERS");
  const mainPrize = fetchMainPrize(categorisedData[0]);
  const secondaryPrize = fetchSecondaryPrize(categorisedData[1]);
  return { mainPrize, secondaryPrize };
};

const extractFileData = async (pdf, lottery) => {
  const parsedPdf = await PdfParse(pdf);
  const lotteryData = parseDataFromText(parsedPdf.text);
  if (lottery) {
    const winnerData = findLottery(lotteryData, lottery);
    if (!winnerData) {
      return {
        lotteryStatus: { status: "There is no prize for this lottery." },
        ...lotteryData,
      };
    }
    return { lotteryStatus: winnerData, ...lotteryData };
  }
  return lotteryData;
};
module.exports = extractFileData;
