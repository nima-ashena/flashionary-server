import { log } from 'console';
import { Vocab } from '../models/vocab.model';
import { VocabGroup, IVocabGroup } from '../models/vocabGroup.model';
import { textToAudioOneApi } from '../utils/text-to-audio-oneapi';
import * as shortid from 'shortid';
import { translateTextOneApi } from '../utils/translate-text-oneapi';
import { Document } from 'mongoose';

export const getVocabGroup = async (req, res, next) => {
   try {
      let vocabGroup: IVocabGroup & Document<any, any, IVocabGroup> =
         await VocabGroup.findById(req.params.id).populate('vocabs');
      for (let i in vocabGroup.vocabs) {
         vocabGroup.vocabs[
            i
         ].audio = `${process.env.BASE_URL}/static/audios/${vocabGroup.vocabs[i].audio}`;
      }

      res.send({
         vocabGroup,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getVocabGroups = async (req, res, next) => {
   try {
      let vocabGroups = await VocabGroup.find()
         .populate('vocabs')
         .sort('-created_at');

      res.send({
         vocabGroups,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addVocabGroup = async (req, res, next) => {
   try {
      const { title, groupKind } = req.body;
      const vocabGroup = new VocabGroup();
      vocabGroup.title = title;
      vocabGroup.groupKind = groupKind;
      vocabGroup.user = req.userId;

      await vocabGroup.save();
      res.send({ vocabGroup });
   } catch (e) {
      console.log(e);

      next(e);
   }
};

export const addVocabToVocabGroup = async (req, res, next) => {
   try {
      let { title, vocabGroupId, meaning, translateApi } = req.body;

      let vocabGroup = await VocabGroup.findById(vocabGroupId);

      if (!vocabGroup) return res.send({ message: 'vocabGroup not found' });

      // add vocab
      title = title.trim();
      const vocab = new Vocab();
      vocab.title = title;
      vocab.user = req.userId;
      vocab.vocabGroup = vocabGroupId;
      const fileName = shortid.generate();
      vocab.audio = `${fileName}.mp3`;
      if (meaning) vocab.meaning = meaning;
      else if (translateApi) vocab.meaning = await translateTextOneApi(title);
      await vocab.save();
      textToAudioOneApi(title, `${fileName}.mp3`);

      vocabGroup.vocabs.push(vocab._id);
      await vocabGroup.save();
      res.send({ vocabGroup, message: 'vocab added ' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const deleteVocabOfVocabGroup = async (req, res, next) => {
   try {
      let { vocabGroupId, vocabId } = req.body;
      if (!vocabGroupId || !vocabId)
         return res.status(401).send({ message: 'Bad Request' });
      let vocabGroup = await VocabGroup.findById(vocabGroupId);
      if (vocabGroup == null)
         return res.send({ message: 'VocabGroup not found' });
      let t = vocabGroup.vocabs.filter(item => item != vocabId);
      vocabGroup.vocabs = t;
      await vocabGroup.save();

      const vocab = await Vocab.remove({ _id: vocabId });

      res.send({ vocabGroup, message: 'Vocab deleted' });
   } catch (e) {
      next(e);
   }
};

// Edit VocabGroup
export const editVocabGroup = async (req, res) => {
   try {
      const vocabGroup = await VocabGroup.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );
      res.send({ vocabGroup, message: 'VocabGroup edited successfully' });
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
};

export const deleteVocabGroup = async (req, res) => {
   try {
      const vocabGroup = await VocabGroup.findByIdAndDelete(req.params.id);
      // const vocabGroup = await VocabGroup.findById(req.params.id);

      let t = vocabGroup.vocabs;
      for (let i in t) {
         await Vocab.findByIdAndDelete(t[i]);
      }

      res.send({
         message: 'VocabGroup deleted successfully',
         vocabGroup,
      });
   } catch (err) {
      console.log(err);

      res.status(500).send(err);
   }
};
