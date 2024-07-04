const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://statelottery.kerala.gov.in/index.php/lottery-result-view";
const scrapeLotteryWinners = async () => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const rows = [];

  $("tbody tr").each((index, element) => {
    const row = {};
    row.title = $(element).find("td.text-left").text().trim();
    row.date = $(element).find("td:nth-child(2)").text().trim();
    row.link = $(element).find("td a").attr("href");
    rows.push(row);
  });

  return { sucess: true, count: rows.length, data: rows };
};

module.exports = scrapeLotteryWinners;
