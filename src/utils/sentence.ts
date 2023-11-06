const qs = require('querystring');
const http = require('https');
const fs = require('fs');
import * as path from 'path';
import { makeId } from './makeId';
const shortid = require('shortid');

export const reqSentenceApi = async (sentence: string) => {
   return new Promise((resolve, rej) => {
      const options = {
         method: 'POST',
         hostname: 'voicerss-text-to-speech.p.rapidapi.com',
         port: null,
         //   path: `/?key=${process.env.RSS_KEY}`,
         path: '/?key=b0b22609bfda41a38f3f4e62ce235941',
         headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key':
               'b226fe37famsh9e30d087bca9c3bp16898djsnf45d2239b519',
            'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com',
            useQueryString: true,
         },
      };

      try {
         const req = http.request(options, function (res) {
            const chunks = [];
            const fileName = shortid.generate();

            res.on('data', function (chunk) {
               chunks.push(chunk);
            });

            res.on('end', function () {
               const body = Buffer.concat(chunks);
               fs.writeFile(
                  path.join(
                     __dirname,
                     '..',
                     '..',
                     'static',
                     'sentences',
                     `${fileName}.mp3`,
                  ),
                  body,
                  () => {
                     console.log('write file down');
                     resolve({ fileName });
                  },
               );
            });
         });

         req.write(
            qs.stringify({
               // src: `conceptually`,
               src: `${sentence}`,
               hl: 'en-us',
               r: '0',
               c: 'mp3',
               f: '8khz_8bit_mono',
            }),
         );
         req.end();
      } catch (e) {
         console.log(e);
         rej(e.message);
      }
   });
};
