import * as fs from 'fs';
import * as Path from 'path';
import { microsoftTTS } from './tts-microsoft';

export const textToAudioOneApi = async (
   text: string,
   filename,
) => {
   try {
      const path = Path.resolve(
         __dirname,
         '..',
         '..',
         'static',
         'audios',
         filename,
      );

      console.log('Text: ' + text);
      text = text.replaceAll(`'`, '');
      text = text.replaceAll('\n', '');
      text = text.replaceAll(`I'd`, 'aiiyd');
      text = text.replaceAll(`"`, '');
      text = text.replaceAll(`’`, '');
      text = text.replaceAll(`/`, ' ');

      microsoftTTS(text, path);
   } catch (e) {
      console.log(e);
   }
};
