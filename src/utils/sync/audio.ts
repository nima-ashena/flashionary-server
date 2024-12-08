import { Vocab } from "../../models/vocab.model";
import { chatGPT } from "../chatGPT";
import * as Path from 'path';
import * as fs from 'fs';
import { textToAudioOneApi } from "../text-to-audio-oneapi";
import { Sentence } from "../../models/sentence.model";


export const syncAllAudios = async () => {
   try {
      const vocabs = await Vocab.find();
      for (let i in vocabs) {
         const audio = vocabs[i].audio
         const noteAudio = vocabs[i].noteAudio
         if (vocabs[i].note == '') {
            vocabs[i].note = await chatGPT(
               `What's the meaning of this word: ${vocabs[i].title}`,
            );
            await vocabs[i].save()
         }

         const path = Path.resolve(
            __dirname,
            '..',
            '..',
            'static',
            'audios',
            audio,
         );

         fs.stat(path, (err, stats) => {
            // lack of file
            if (err || stats.size < 1000) {
               textToAudioOneApi(vocabs[i].title, vocabs[i].audio);
            }

            // stats.isFile(); // true
            // stats.isDirectory(); // false
            // stats.isSymbolicLink(); // false
            // stats.size; // 1024000 //= 1MB
         });

         const notePath = Path.resolve(
            __dirname,
            '..',
            '..',
            'static',
            'audios',
            noteAudio,
         );

         fs.stat(notePath, (err, stats) => {
            // lack of file
            if (err || stats.size < 1000) {
               textToAudioOneApi(vocabs[i].note, vocabs[i].noteAudio);
            }
         });

         //await vocabs[i].save();
      }

      const sentences = await Sentence.find();
      for (let i in sentences) {
         const audio = sentences[i].audio
         const noteAudio = sentences[i].noteAudio

         const path = Path.resolve(
            __dirname,
            '..',
            '..',
            'static',
            'audios',
            audio,
         );

         fs.stat(path, (err, stats) => {
            // lack of file
            if (err || stats.size < 1000) {
               textToAudioOneApi(sentences[i].context, sentences[i].audio);
            }
         });

         const notePath = Path.resolve(
            __dirname,
            '..',
            '..',
            'static',
            'audios',
            noteAudio,
         );

         fs.stat(notePath, (err, stats) => {
            // lack of file
            if (err || stats.size < 1000) {
               textToAudioOneApi(sentences[i].note, sentences[i].noteAudio);
            }
         });
      }
   } catch (err) {

      console.log(err);
   }
};