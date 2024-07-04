const findLottery = (data, lottery) => {
  let found = false;
  const result = {};
  data.mainPrize.map((item) => {
    if (item.data.includes(lottery)) {
      found = true;
      result.lottery = lottery;
      result.title = item.title;
      result.category = "mainPrize";
      result.data = item.data;
    }
  });
  if (!found) {
    data.secondaryPrize.map((item) => {
      if (item.data.includes(lottery)) {
        found = true;
        result.lottery = lottery;
        result.title = item.title;
        result.category = "secondaryPrize";
        result.data = item.data;
      }
    });
  }
  if (!found) {
    return false;
  }
  return result;
};

module.exports = findLottery;
