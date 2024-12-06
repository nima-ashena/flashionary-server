import axios from 'axios';

export const translateTextOneApi = async (text: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;

      const url = `https://api.one-api.ir/translate/v1/google/`;

        const r = await axios.post(
            url,
            {
                source: 'en',
                target: 'fa',
                text,
            },
            {
                headers: {
                    accept: 'application/json',
                    'one-api-token': token,
                    'Content-Type': 'application/json',
                },
            },
        );

      return r.data.result;
   } catch (e) {
      console.log(e);
   }
};
