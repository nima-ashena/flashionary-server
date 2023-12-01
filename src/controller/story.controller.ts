import { log } from 'console';
import { Sentence } from '../models/sentence.model';
import { Story, IStory } from '../models/story.model';
import { textToAudioOneApi } from '../utils/text-to-audio-oneapi';
import * as shortid from 'shortid';
import { translateTextOneApi } from '../utils/translate-text-oneapi';

export const getStory = async (req, res, next) => {
   try {
      let story = await Story.findById(req.params.id)
         .populate('sentences')
         .populate('flags')
         .populate('toughs');
      for (let i in story.sentences) {
         story.sentences[
            i
         ].audio = `${process.env.BASE_URL}/static/nima/sentences/${story.sentences[i].audio}`;
      }
      for (let i in story.flags) {
         story.flags[
            i
         ].audio = `${process.env.BASE_URL}/static/nima/sentences/${story.flags[i].audio}`;
      }
      for (let i in story.toughs) {
         story.toughs[
            i
         ].audio = `${process.env.BASE_URL}/static/nima/sentences/${story.toughs[i].audio}`;
      }

      res.send({
         story,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getStories = async (req, res, next) => {
   try {
      let stories = await Story.find()
         .populate('sentences')
         .sort('-created_at');

      res.send({
         stories,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addStory = async (req, res, next) => {
   try {
      const { title, user, note, category } = req.body;
      const story = new Story();
      story.title = title;
      story.user = user;
      story.note = note;
      story.category = category;

      await story.save();
      res.send({ story });
   } catch (e) {
      console.log(e);

      next(e);
   }
};

export const addSentenceToStory = async (req, res, next) => {
   try {
      let {
         context,
         storyId,
         meaning,
         translateApi,
         TTSEngine,
         storyFlag,
         storyTough,
      } = req.body;

      let story = await Story.findById(storyId);

      if (!story) return res.send({ message: 'story not found' });

      // add sentence
      context = context.trim();
      const fileName = shortid.generate();
      const sentence = new Sentence();
      sentence.context = context;
      sentence.audio = `${fileName}.mp3`;
      sentence.story = storyId;
      sentence.storyFlag = storyFlag;
      sentence.storyTough = storyTough;
      textToAudioOneApi(context, 'sentences', `${fileName}.mp3`, TTSEngine);
      if (meaning) sentence.meaning = meaning;
      else if (translateApi)
         sentence.meaning = await translateTextOneApi(context);
      await sentence.save();

      story.sentences.push(sentence._id);
      if (storyFlag) {
         story.flags.push(sentence._id);
      }
      if (storyTough) {
         story.toughs.push(sentence._id);
      }
      await story.save();
      res.send({ story, message: 'sentence added ' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const deleteSentenceOfStory = async (req, res, next) => {
   try {
      let { storyId, sentenceId } = req.body;
      if (!storyId || !sentenceId)
         return res.status(401).send({ message: 'Bad Request' });
      let story = await Story.findById(storyId);
      if (story == null) return res.send({ message: 'Story not found' });
      let t = story.sentences.filter(item => item != sentenceId);
      story.sentences = t;
      await story.save();

      const sentence = await Sentence.remove({ _id: sentenceId });

      res.send({ story, message: 'Sentence deleted' });
   } catch (e) {
      next(e);
   }
};

// Edit Story
export const editStory = async (req, res) => {
   try {
      const story = await Story.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );
      res.send({ story, message: 'Story edited successfully' });
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
};

export const deleteStory = async (req, res) => {
   try {
      const story = await Story.findByIdAndDelete(req.params.id);
      // const story = await Story.findById(req.params.id);

      let t = story.sentences;
      for (let i in t) {
         await Sentence.findByIdAndDelete(t[i]);
      }

      res.send({
         message: 'Story deleted successfully',
         story,
      });
   } catch (err) {
      console.log(err);

      res.status(500).send(err);
   }
};
