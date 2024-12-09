import { Vocab } from "../../models/vocab.model";
import { chatGPT } from "../chatGPT";
import * as Path from 'path';
import * as fs from 'fs';
import { textToAudioOneApi } from "../text-to-audio-oneapi";
import { Sentence } from "../../models/sentence.model";


export const syncAllAudios = async (): Promise<any> => {
   try {
      return new Promise(async (resolve, reject) => {
         const vocabs = await Vocab.find();
         for (let i in vocabs) {
            const audio = vocabs[i].audio
            const path = Path.resolve(
               __dirname,
               '..',
               '..',
               '..',
               'static',
               'audios',
               audio,
            );
            fs.stat(path, async (err, stats) => {
               // lack of file
               if (err) {
                   await textToAudioOneApi(vocabs[i].title, vocabs[i].audio);
               }
           });
         }

         const sentences = await Sentence.find();
         for (let i in sentences) {
            const audio = sentences[i].audio
            const path = Path.resolve(
               __dirname,
               '..',
               '..',
               '..',
               'static',
               'audios',
               audio,
            );
            fs.stat(path, async (err, stats) => {
               // lack of file
               if (err || stats.size < 1000) {
                  await textToAudioOneApi(sentences[i].context, sentences[i].audio);
               }
            });
         }
         resolve('done')

      });
   } catch (err) {

      console.log(err);
   }
};