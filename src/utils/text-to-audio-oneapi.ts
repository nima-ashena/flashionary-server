import * as fs from 'fs';
import * as Path from 'path';
import axios from 'axios';
import { googleTTS } from './tts-google';
import { microsoftTTS } from './tts-microsoft';

export const textToAudioOneApi = async (
   text: string,
   type: string,
   filename,
   TTSType: string = 'Google',
) => {
   console.log('TTSType', TTSType);
   console.log();
   try {
      const path = Path.resolve(
         __dirname,
         '..',
         '..',
         'static',
         'nima',
         type,
         filename,
      );

      text = text.replaceAll(`'`, '');
      text = text.replaceAll(`"`, '');
      text = text.replaceAll(`’`, '');

      if (TTSType === 'Google') googleTTS(text, path);
      else if (TTSType === 'Microsoft') microsoftTTS(text, path);
   } catch (e) {
      console.log(e);
      throw { message: e.message, statusCode: 500 };
   }
};
