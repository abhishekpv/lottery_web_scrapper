const express = require("express");
const scrapeLotteryWinners = require("../app/scrapeLotteryWinners");
const findWinner = require("../app/findWinner");
const { injectSpeedInsights } = require("@vercel/speed-insights");

injectSpeedInsights();
const app = express();
app.use(express.json());
const router = express.Router();

app.use("/", router);

router.get("/lotteries", async (req, res, next) => {
  const lotteries = await scrapeLotteryWinners();
  res.status(200).json(lotteries);
});

router.get("/winner", async (req, res, next) => {
  const { lottery, pdf } = req.query;
  const winner = await findWinner(lottery, pdf);
  res.status(200).json(winner);
});

module.exports = app;
