import axios from 'axios';

export const chatGPT = async (query: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;
      const url = `https://one-api.ir/chatgpt/?token=${token}&action=gpt3.5-turbo&q=${query}`;

      const r = await axios.get(url);

      console.log(r.data.result);

      return r.data.result[0];
   } catch (e) {
      console.log(e);
   }
};
