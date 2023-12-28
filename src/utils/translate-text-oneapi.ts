import axios from 'axios';

export const translateTextOneApi = async (text: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;
      const action = 'google';
      const lang = 'fa';
      // console.log('translateApi: ' + text);

      const url = `https://one-api.ir/translate/?token=${token}&action=${action}&lang=${lang}&q=${text}`;

      const r = await axios.get(url);

      return r.data.result;
   } catch (e) {
      console.log(e);
   }
};
