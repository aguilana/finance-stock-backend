import axios, { AxiosResponse } from 'axios';

const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = process.env.NEW_API_KEY;

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
}

async function getNewsForStock(ticker: string): Promise<NewsArticle[]> {
  try {
    const { data }: AxiosResponse<{ articles: NewsArticle[] }> =
      await axios.get(NEWS_API_ENDPOINT, {
        params: {
          q: ticker,
          apiKey: NEWS_API_KEY,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
        },
      });
    return data.articles;
  } catch (error) {
    throw error;
  }
}

export { getNewsForStock };
