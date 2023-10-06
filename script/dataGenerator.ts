const dateGenerator = (daysAgo: number): Date => {
  let date = new Date();
  date.setDate(date.getDate() - daysAgo);

  // Adjust for weekends. If the date is Saturday, go back one more day (to Friday).
  // If the date is Sunday, go back two more days (to Friday).
  if (date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  } else if (date.getDay() === 0) {
    date.setDate(date.getDate() - 2);
  }

  return date;
};

export const generatePrices = (stockId: number, basePrice: number): any => {
  let prices = [];
  for (let i = 0; i < 7; i++) {
    // 7 days of data
    let dailyPrice = {
      stockId: stockId,
      date: dateGenerator(i),
      open: basePrice - 5 + Math.random() * 10, // price +-5
      close: basePrice - 5 + Math.random() * 10,
      high: basePrice + Math.random() * 5,
      low: basePrice - 10 + Math.random() * 5,
      volume: 5000000 + Math.floor(Math.random() * 5000000), // random volume between 5M and 10M
    };
    prices.push(dailyPrice);
  }
  return prices;
};
