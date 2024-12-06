import axios from 'axios';

export const chatGPT = async (query: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;
      const url = `https://api.one-api.ir/chatbot/v1/gpt4o/`;

      
      const r = await axios.post(
         url,
         [
             {
                 role: 'user',
                 content: "what's the meaning of 'entertainer'?",
             },
         ],
         {
             headers: {
                 accept: 'application/json',
                 'one-api-token': token,
                 'Content-Type': 'application/json',
             },
         },
     );


      return r.data.result[0];
   } catch (e) {
      console.log(e);
   }
};
