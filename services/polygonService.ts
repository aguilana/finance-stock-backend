import axios from 'axios';

export const getStockData = async (symbol: string) => {
  try {
    // Get today's date
    const today = new Date();

    // get the day of the week
    const day = today.getDay();

    console.log({ day });
    // adjustment
    let adjustment = 1;

    // If today is Sunday, adjust to last Friday
    if (day === 0) adjustment += 1;

    // If today is Monday, adjust to last Friday
    if (day === 1) adjustment += 2;

    console.log({ adjustment });
    // Subtract 1 day
    today.setDate(today.getDate() - adjustment);

    console.log({ today });

    // Format the date as YYYY-MM-DD
    const date = today.toISOString().split('T')[0];

    // Construct the URL with the formatted date
    const url = `https://api.polygon.io/v1/open-close/${symbol}/${date}`;
    const response = await axios.get(url, {
      params: {
        adjusted: true,
        apiKey: process.env.POLYGON_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
