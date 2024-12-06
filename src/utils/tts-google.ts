import * as fs from 'fs';
import * as Path from 'path';
import axios from 'axios';

export const googleTTS = async (text: string, path: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;
      const lang = 'en-US';
      const url = `https://one-api.ir/tts/?token=${token}&action=google&lang=${lang}&q=${text}`;

      try {
         const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
         });
         response.data.pipe(fs.createWriteStream(path));
         return new Promise((resolve, reject) => {
            response.data.on('end', () => {
               resolve('Done!');
            });
            response.data.on('error', () => {
               console.log('error on google TTS');
               reject();
            });
         });
      } catch (e) {
         console.log(e.message);
      }
   } catch (e) {
      console.log(e);
   }
};
