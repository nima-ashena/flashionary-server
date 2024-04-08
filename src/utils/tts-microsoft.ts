import * as fs from 'fs';
import * as Path from 'path';
import axios from 'axios';

export const microsoftTTS = async (text: string, path: string) => {
   try {
      const token = process.env.ONE_API_TOKEN;
      // women
      // const lang = 'en-US-MichelleNeural';
      const lang = 'en-US-JennyNeural';
      //men
      // const lang = "en-US-SteffanNeural";
      // const lang = "en-US-GuyNeural"
      const rate = 0;
      const url = `https://one-api.ir/tts/?token=${token}&action=microsoft&lang=${lang}&q=${text}&rate=${rate}`;

      console.log("here");
      try {
         const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
         });
         response.data.pipe(fs.createWriteStream(path));
         return new Promise((resolve, reject) => {
            response.data.on('end', () => {
               console.log('done');
               resolve('Done!');
            });
            response.data.on('error', () => {
               console.log('error');
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
