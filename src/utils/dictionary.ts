var fs = require('fs');
const path = require('path');
var request = require('request');
import { IVocab, Vocab } from '../models/vocab.model';

import axios from 'axios';
import { reqSentenceApi } from './sentence';
import { textToAudioAliso } from './text-to-audio-aliso';
import { textToAudioOneApi } from './text-to-audio-oneapi';

export const reqVocabApi = async (title: string) => {
   try {
      let vocab_obj = {};
      await axios
         .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${title}`)
         .then(res => {
            vocab_obj = saveVocab(title, res.data[0]);
         })
         .catch(e => {
            console.log(e.message);
         });

      return vocab_obj;
   } catch (e) {
      console.log(e);
   }
};

const saveVocab = async (title, data) => {
   const vocab: IVocab = { title };

   // No Need more
   // try {
   //    let is_audio_saved = false;
   //    // step one: save audio using free dictionary api
   //    for (let i = 0; i < data.phonetics.length; i++) {
   //       if (data.phonetics[i].audio) {
   //          await saveAudioDictionaryApi(data.phonetics[i].audio, data.word);
   //          is_audio_saved = true;
   //          break;
   //       }
   //    }
   //    // if step one failed
   //    // step two using oneApi.ir
   //    if (!is_audio_saved) {
   //       console.log(`save via OneApi: ${title}`);
   //       textToAudioOneApi(title, 'vocabs', `${title}.mp3`);
   //       // await textToAudio(data.word, 'nima/vocabs', data.word);
   //    }
   // } catch (e) {
   //    console.log(e.message);
   // }

   vocab.title = title;
   vocab.phonetics = data?.phonetics[0]?.text;
   vocab.audio = `${title}.mp3`;
   vocab.type = data.meanings[0]?.partOfSpeech;
   vocab.definition = data?.meanings[0]?.definitions[0]?.definition;
   vocab.example = data.meanings[0]?.definitions[0]?.example;

   return vocab;
};

// Dictionary Api
function saveAudioDictionaryApi(url, title) {
   return new Promise((resole, rej) => {
      request
         .get(url)
         .on('error', function (err: Error) {
            console.log(err.message);
            rej(err.message);
            // handle error
         })
         .pipe(
            fs.createWriteStream(
               path.join(
                  __dirname,
                  '..',
                  '..',
                  'static',
                  'audios',
                  `${title}.mp3`,
               ),
            ),
         );
      resole('done');
   });
}
