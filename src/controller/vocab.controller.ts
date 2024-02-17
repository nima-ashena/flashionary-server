import * as fs from 'fs';
import * as path from 'path';
import * as shortid from 'shortid';

import { Vocab, IFilterVocab, IVocab } from '../models/vocab.model';
import { reqVocabApi } from '../utils/dictionary';
import { textToAudioOneApi } from '../utils/text-to-audio-oneapi';
import { translateTextOneApi } from '../utils/translate-text-oneapi';
import { Sentence } from '../models/sentence.model';
import { log, table } from 'console';
import mongoose from 'mongoose';
import { chatGPT } from '../utils/chatGPT';

export const getVocab = async (req, res, next) => {
   try {
      const vocab = await Vocab.findById(req.params.id)
         .populate('sentences')
         .populate('vocabs');

      vocab.audio = `${process.env.BASE_URL}/static/nima/vocabs/${vocab.audio}`;
      vocab.noteAudio = `${process.env.BASE_URL}/static/nima/vocabs/${vocab.noteAudio}`;
      for (let i in vocab.sentences) {
         vocab.sentences[
            i
         ].audio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.sentences[i].audio}`;
         vocab.sentences[
            i
         ].noteAudio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.sentences[i].noteAudio}`;
      }
      res.send({
         vocab,
      });
   } catch (e) {
      next(e);
   }
};

export const getVocabs = async (req, res, next) => {
   try {
      const {
         query,
         trueGuessLimitMax,
         trueGuessLimitMin,
         sort,
         limit,
         page,
         user,
         dictMode,
         reviewMode,
         vocabGroup,
         compoundType,
      } = req.query;

      let filter: IFilterVocab = {};
      let sortFilter = new Map();
      let responseFilter = { totalCount: 0, page: 1, pages: 1 };
      if (query) {
         filter.title = { $regex: `${query}`, $options: 'i' };
      }
      if (trueGuessLimitMax && trueGuessLimitMin) {
         if (reviewMode) {
            filter.reviewTrueGuessCount = {
               $lte: trueGuessLimitMax,
               $gte: trueGuessLimitMin,
            };
         } else if (dictMode) {
            filter.dictTrueGuessCount = {
               $lte: trueGuessLimitMax,
               $gte: trueGuessLimitMin,
            };
         }
      }

      if (sort) {
         if (sort[0] == '-') {
            sortFilter.set(sort.substr(1), -1);
         } else {
            sortFilter.set(sort, 1);
         }
      }
      if (dictMode) {
         filter.dictImportance = true;
         sortFilter.set('dict_last_check_at', 1);
      }

      if (reviewMode) {
         filter.reviewImportance = true;
         sortFilter.set('review_last_check_at', 1);
      }

      if (compoundType) {
         if (compoundType === 'all') {
            //
         } else {
            filter.compoundType = compoundType;
         }
      }

      if (user) {
         filter.user = user;
      }

      if (vocabGroup) {
         if (vocabGroup == 'all') {
            //
         } else if (vocabGroup == 'free') filter.vocabGroup = null;
         else filter.vocabGroup = vocabGroup;
      }

      const vocabs = await Vocab.find(filter)
         .sort(sortFilter)
         .limit(Number(limit))
         .skip(Math.max((Number(page) - 1) * Number(limit), 0))
         .populate('sentences');

      responseFilter.totalCount = (await Vocab.find(filter)).length;
      if (page) responseFilter.page = Number(page);
      responseFilter.pages = Math.ceil(
         responseFilter.totalCount / Number(limit),
      );
      for (let index in vocabs) {
         vocabs[
            index
         ].audio = `${process.env.BASE_URL}/static/nima/vocabs/${vocabs[index].audio}`;
         vocabs[
            index
         ].noteAudio = `${process.env.BASE_URL}/static/nima/vocabs/${vocabs[index].noteAudio}`;
         for (let index2 in vocabs[index].sentences) {
            vocabs[index].sentences[
               index2
            ].audio = `${process.env.BASE_URL}/static/nima/sentences/${vocabs[index].sentences[index2].audio}`;
            vocabs[index].sentences[
               index2
            ].noteAudio = `${process.env.BASE_URL}/static/nima/sentences/${vocabs[index].sentences[index2].noteAudio}`;
         }
      }

      res.send({
         responseFilter,
         vocabs,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addVocab = async (req, res, next) => {
   try {
      let title: string = req.body.title;
      title = title.trim();
      title = title.toLowerCase();
      let vocabLength = title.split(' ').length;

      if (await Vocab.findOne({ title, user: req.body.user })) {
         return res
            .status(401)
            .send({ message: 'This vocab is already exits' });
      }

      const {
         user,
         phonetics,
         meaning,
         type,
         note,
         dictionaryApi,
         translateApi,
         TTSEngine,
      }: IVocab = req.body;
      const vocab = new Vocab();

      if (dictionaryApi) {
         const data = await reqVocabApi(title);
         vocab.set(data);
      }

      if (vocabLength > 1) {
         vocab.compoundType = 'Open';
      }

      vocab.title = title;
      vocab.user = user;
      vocab.note = note;
      vocab.meaning = meaning;
      if (!meaning && req.body.translateApi) {
         vocab.meaning = await translateTextOneApi(title);
      }
      if (!note && req.body.noteApi) {
         vocab.note = await chatGPT(
            `What's the meaning of this word: ${title}`,
         );
      }
      const fileName = shortid.generate();
      const audioNoteFileName = shortid.generate();
      vocab.audio = `${fileName}.mp3`;
      vocab.noteAudio = `${audioNoteFileName}.mp3`;
      textToAudioOneApi(title, 'vocabs', `${fileName}.mp3`, TTSEngine);
      textToAudioOneApi(title, 'vocabs', `${audioNoteFileName}.mp3`, TTSEngine);
      if (type) vocab.type = type;
      if (phonetics) vocab.phonetics = phonetics;
      if (vocab.example) {
         let e = vocab.example;
         const fileName = shortid.generate();
         // adding sentences
         const sentence = new Sentence();
         sentence.context = e.trim();
         sentence.audio = `${fileName}.mp3`;
         sentence.user = user;
         sentence.type = 'Other';
         // sentence.vocab = vocabId;
         textToAudioOneApi(sentence.context, 'sentences', `${fileName}.mp3`);
         let t = await sentence.save();
         vocab.sentences.push(t._id);
      }

      await vocab.save();
      res.send({ vocab });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit Vocab
export const editVocab = async (req, res) => {
   try {
      const vocab = await Vocab.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      ).populate('sentences');

      if (req.files) {
         try {
            await fs.unlinkSync(
               path.join(
                  __dirname,
                  '..',
                  '..',
                  'static',
                  'nima',
                  'vocabs',
                  `${vocab.audio}`,
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
               'nima',
               'vocabs',
               vocab.audio,
            ),
         );
      }

      vocab.audio = `${process.env.BASE_URL}/static/nima/vocabs/${vocab.audio}`;
      vocab.noteAudio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.noteAudio}`;
      for (let i in vocab.sentences) {
         vocab.sentences[
            i
         ].audio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.sentences[i].audio}`;
         vocab.sentences[
            i
         ].noteAudio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.sentences[i].noteAudio}`;
      }
      res.send({
         message: 'Vocab edited successfully',
         vocab,
      });
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
};

export const deleteVocab = async (req, res) => {
   try {
      const vocab = await Vocab.findByIdAndDelete(req.params.id);

      try {
         await fs.unlinkSync(
            path.join(
               __dirname,
               '..',
               '..',
               'static',
               'nima',
               'vocabs',
               `${vocab.audio}`,
            ),
         );
      } catch (e) {}

      vocab.audio = `${process.env.BASE_URL}/dict/static/nima/vocabs/${vocab.audio}`;
      res.send({
         message: 'Deleted edited successfully',
         vocab,
      });
   } catch (err) {
      console.log(err);
      res.status(500).send(err);
   }
};

export const pulsTrueVocab = async (req, res, next) => {
   try {
      const { vocabId, plusType } = req.body;
      const vocab = await Vocab.findOne({ _id: vocabId });
      if (vocab == null) {
         res.send({ message: "This vocab doesn't exits" });
      }
      if (plusType === 'review') {
         vocab.review_last_check_at = new Date();
         let counter = Number(vocab.reviewTrueGuessCount);
         counter++;
         vocab.reviewTrueGuessCount = counter;
      } else if (plusType === 'dict') {
         vocab.dict_last_check_at = new Date();
         let counter = Number(vocab.dictTrueGuessCount);
         counter++;
         vocab.dictTrueGuessCount = counter;
      }
      if (vocab.dictTrueGuessCount >= 15 && vocab.reviewTrueGuessCount >= 15)
         vocab.completed = true;
      await vocab.save();

      res.send(vocab);
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const syncVocabAudio = async (req, res, next) => {
   try {
      const { _id, TTSEngine, type } = req.body;
      const vocab = await Vocab.findOne({ _id });

      if (!vocab) {
         res.send({ message: "This vocab doesn't exits" });
      }

      const fileName = shortid.generate();
      if (type === 'note') {
         vocab.noteAudio = `${fileName}.mp3`;
         await textToAudioOneApi(
            vocab.note,
            'sentences',
            vocab.noteAudio,
            TTSEngine,
         );
      } else if (type === 'title') {
         vocab.audio = `${fileName}.mp3`;
         await textToAudioOneApi(vocab.title, 'vocabs', vocab.audio, TTSEngine);
      }

      await vocab.save();
      vocab.audio = `${process.env.BASE_URL}/static/nima/vocabs/${vocab.audio}`;
      vocab.noteAudio = `${process.env.BASE_URL}/static/nima/sentences/${vocab.noteAudio}`;

      res.send({ vocab });
   } catch (e) {
      next(e);
   }
};

export const addSentenceToVocab = async (req, res, next) => {
   try {
      let { context, vocabId, TTSEngine } = req.body;

      let vocab = await Vocab.findById(vocabId);

      if (!vocab) return res.send({ message: 'vocab not found' });

      // add sentence
      context = context.trim();
      const fileName = shortid.generate();
      const sentence = new Sentence();
      sentence.context = context;
      sentence.audio = `${fileName}.mp3`;
      sentence.vocab = vocabId;
      sentence.type = 'Other';
      sentence.user = req.userId;
      textToAudioOneApi(context, 'sentences', `${fileName}.mp3`, TTSEngine);
      await sentence.save();

      vocab.sentences.push(sentence._id);
      await vocab.save();
      res.send({ vocab, message: 'sentence added ' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addVocabToVocab = async (req, res, next) => {
   try {
      let { vocabId, title, meaning, translateApi, TTSEngine } = req.body;

      let mainVocab = await Vocab.findById(vocabId);

      if (!mainVocab) return res.send({ message: 'vocab not found' });

      // add vocab
      title = title.trim();
      const vocab = new Vocab();
      vocab.title = title;
      vocab.user = req.userId;
      const fileName = shortid.generate();
      vocab.audio = `${fileName}.mp3`;
      vocab.meaning = meaning;
      if (!meaning && translateApi) {
         vocab.meaning = await translateTextOneApi(title);
      }
      vocab.vocabs = mainVocab.vocabs;
      vocab.vocabs.push(mainVocab._id);
      mainVocab.vocabs.map(async item => {
         let v = await Vocab.findById(item);
         console.log(v);
         console.log();
         if (v) {
            v.vocabs.push(vocab._id);
            await v.save();
         }
      });
      mainVocab.vocabs.push(vocab._id);
      await vocab.save();
      await mainVocab.save();
      textToAudioOneApi(title, 'vocabs', `${fileName}.mp3`);

      res.send({ mainVocab, message: 'vocab added ' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const deleteSentenceOfVocab = async (req, res, next) => {
   try {
      let { vocabId, sentenceId } = req.body;
      let vocab = await Vocab.findById(vocabId);

      if (!vocab) return res.send({ message: 'vocab not found' });

      let t = vocab.sentences.filter(item => item != sentenceId);
      vocab.sentences = t;
      await vocab.save();

      const newVocab = await Vocab.findById(vocabId).populate('sentences');
      res.send({ newVocab, message: 'Sentence deleted' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const cloneVocab = async (req, res, next) => {
   try {
      const userId = req.userId;
      const vocab = await Vocab.findById(req.body.vocabId);
      const vocab2 = await Vocab.find({ title: vocab.title, user: userId });
      if (vocab2.length != 0) {
         return res
            .status(401)
            .send({ message: 'You already cloned this vocab' });
      }
      // t._id = mongoose.Types.ObjectId();
      const clonedVocab = await Vocab.create({
         title: vocab.title,
         meaning: vocab.meaning,
         phonetics: vocab.phonetics,
         audio: vocab.audio,
         type: vocab.type,
         definition: vocab.definition,
         sentences: vocab.sentences,
         user: userId,
      });

      res.send({ clonedVocab });
   } catch (e) {
      next(e);
   }
};
