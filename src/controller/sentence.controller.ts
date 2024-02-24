import * as shortid from 'shortid';
import * as fs from 'fs';
import * as path from 'path';

import {
   IFilterSentence,
   ISentence,
   Sentence,
   SentenceTypes,
} from '../models/sentence.model';
import { textToAudioOneApi } from '../utils/text-to-audio-oneapi';
import { translateTextOneApi } from '../utils/translate-text-oneapi';
import { log } from 'console';
import { chatGPT } from '../utils/chatGPT';

export const getSentence = async (req, res, next) => {
   try {
      const sentence = await Sentence.findById(req.params.id);
      sentence.audio = `${process.env.BASE_URL}/static/audios/${sentence.audio}`;
      sentence.noteAudio = `${process.env.BASE_URL}/static/audios/${sentence.noteAudio}`;
      res.send({
         sentence,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Sentences
export const getSentences = async (req, res, next) => {
   try {
      const {
         query,
         trueGuessLimitMax,
         trueGuessLimitMin,
         sort,
         limit,
         page,
         story,
         type,
         user,
         mode,
      } = req.query;

      let filter: IFilterSentence = {};
      let sortFilter = new Map();
      let responseFilter = { totalCount: 0, page: 1, pages: 1 };
      if (query) {
         filter.context = { $regex: `${query}`, $options: 'i' };
      }
      if (trueGuessLimitMax && trueGuessLimitMin) {
         if (mode === 'review') {
            filter.reviewTrueGuessCount = {
               $lte: trueGuessLimitMax,
               $gte: trueGuessLimitMin,
            };
         } else if (mode === 'replacement') {
            filter.replacementTrueGuessCount = {
               $lte: trueGuessLimitMax,
               $gte: trueGuessLimitMin,
            };
         } else if (mode === 'dict') {
            filter.dictTrueGuessCount = {
               $lte: trueGuessLimitMax,
               $gte: trueGuessLimitMin,
            };
         }
      }
      if (story) {
         if (story == 'all') {
         } else if (story == 'free') filter.story = null;
         else filter.story = story;
      }

      if (sort) {
         if (sort[0] == '-') {
            sortFilter.set(sort.substr(1), -1);
         } else {
            sortFilter.set(sort, 1);
         }
      }
      if (mode === 'review') {
         filter.reviewImportance = true;
         sortFilter.set('review_last_check_at', 1);
      }
      if (mode === 'replacement') {
         filter.replacementImportance = true;
         sortFilter.set('replacement_last_check_at', 1);
      }
      if (mode === 'dict') {
         filter.dictImportance = true;
         sortFilter.set('dict_last_check_at', 1);
      }

      if (type) {
         if (type === 'all') {
            filter.type = {
               $in: ['Simple', 'Expression', 'SemanticPoint'],
            };
         } else filter.type = type;
      }

      if (user) {
         filter.user = user;
      }

      const sentences = await Sentence.find(filter)
         .sort(sortFilter)
         .limit(Number(limit))
         .skip(Math.max((Number(page) - 1) * Number(limit), 0));

      responseFilter.totalCount = (await Sentence.find(filter)).length;
      if (page) responseFilter.page = Number(page);
      responseFilter.pages = Math.ceil(
         responseFilter.totalCount / Number(limit),
      );

      for (let index in sentences) {
         sentences[
            index
         ].audio = `${process.env.BASE_URL}/static/audios/${sentences[index].audio}`;
         sentences[
            index
         ].noteAudio = `${process.env.BASE_URL}/static/audios/${sentences[index].noteAudio}`;
      }

      res.send({ responseFilter, sentences });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Add sentences
export const addSentences = async (req, res, next) => {
   try {
      let { context, meaning, note, TTSEngine, user, type }: ISentence =
         req.body;

      context = context.trim();

      const audioFileName = shortid.generate();
      const audioNoteFileName = shortid.generate();
      const sentence = new Sentence();
      sentence.context = context;
      sentence.audio = `${audioFileName}.mp3`;
      sentence.noteAudio = `${audioNoteFileName}.mp3`;
      sentence.note = note;
      sentence.meaning = meaning;
      sentence.user = user;
      sentence.type = type;

      textToAudioOneApi(context, `${audioFileName}.mp3`, TTSEngine);
      if (!meaning && req.body.translateApi) {
         sentence.meaning = await translateTextOneApi(context);
      }
      if (!note && req.body.noteApi) {
         sentence.note = await chatGPT(`What's the meaning of: ${context}`);
         textToAudioOneApi(
            sentence.note,
            `${audioNoteFileName}.mp3`,
            TTSEngine,
         );
      }

      await sentence.save();

      res.send({ sentence });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit Sentence
export const editSentence = async (req, res) => {
   try {
      const sentence = await Sentence.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );

      if (req.files) {
         try {
            await fs.unlinkSync(
               path.join(
                  __dirname,
                  '..',
                  '..',
                  'static',
                  'audios',
                  `${sentence.audio}`,
               ),
            );
         } catch (e) {}

         let audioFile = req.files.audioFile;

         //Use the mv() method to place the file in the upload directory (i.e. "uploads")
         audioFile.mv(
            path.join(
               __dirname,
               '..',
               '..',
               'static',
               'audios',
               sentence.audio,
            ),
         );
      }

      sentence.audio = `${process.env.BASE_URL}/static/audios/${sentence.audio}`;
      sentence.noteAudio = `${process.env.BASE_URL}/static/audios/${sentence.noteAudio}`;

      res.send({
         message: 'sentence edited successfully',
         sentence,
      });
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
};

export const deleteSentence = async (req, res) => {
   try {
      const sentence = await Sentence.findByIdAndDelete(req.params.id);

      try {
         await fs.unlinkSync(
            path.join(
               __dirname,
               '..',
               '..',
               'static',
               'audios',
               `${sentence.audio}`,
            ),
         );
      } catch (e) {}

      sentence.audio = `${process.env.BASE_URL}/dict/static/audios/${sentence.audio}`;
      res.send({
         message: 'Sentence edited successfully',
         sentence,
      });
   } catch (err) {
      console.log(err);

      res.status(500).send(err);
   }
};

// plus counter
export const plusTrueSentences = async (req, res) => {
   const { sentenceId, plusType } = req.body;
   const sentence = await Sentence.findOne({ _id: sentenceId });
   if (!sentence) {
      res.send.status(404)({ message: "This sentence doesn't exits" });
   }
   if (plusType === 'review') {
      sentence.review_last_check_at = new Date();
      let counter = Number(sentence.reviewTrueGuessCount);
      counter++;
      sentence.reviewTrueGuessCount = counter;
   } else if (plusType === 'replacement') {
      sentence.replacement_last_check_at = new Date();
      let counter = Number(sentence.replacementTrueGuessCount);
      counter++;
      sentence.replacementTrueGuessCount = counter;
   } else if (plusType === 'dict') {
      sentence.dict_last_check_at = new Date();
      let counter = Number(sentence.dictTrueGuessCount);
      counter++;
      sentence.dictTrueGuessCount = counter;
   }

   await sentence.save();

   res.send({ sentence });
};

export const syncSentenceAudio = async (req, res, next) => {
   try {
      const { _id, TTSEngine, type } = req.body;

      const sentence = await Sentence.findOne({ _id });

      if (!sentence) {
         res.send({ message: "This sentence doesn't exits" });
      }
      const fileName = shortid.generate();

      if (type === 'note') {
         sentence.noteAudio = `${fileName}.mp3`;
         await textToAudioOneApi(
            sentence.note,
            `${sentence.noteAudio}`,
            TTSEngine,
         );
      } else if (type === 'context') {
         sentence.audio = `${fileName}.mp3`;
         await textToAudioOneApi(
            sentence.context,
            `${sentence.audio}`,
            TTSEngine,
         );
      }

      await sentence.save();
      sentence.audio = `${process.env.BASE_URL}/static/audios/${sentence.audio}`;

      res.send({ sentence });
   } catch (e) {
      next(e);
   }
};

export const cloneSentence = async (req, res, next) => {
   try {
      const userId = req.userId;
      const sentence = await Sentence.findById(req.body.sentenceId);

      // t._id = mongoose.Types.ObjectId();
      const clonedSentence = await Sentence.create({
         context: sentence.context,
         meaning: sentence.meaning,
         note: sentence.note,
         audio: sentence.audio,
         type: sentence.type,
         user: userId,
      });

      res.send({ clonedSentence });
   } catch (e) {
      next(e);
   }
};
