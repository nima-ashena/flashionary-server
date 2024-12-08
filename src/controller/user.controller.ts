import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import * as Path from 'path';
import * as fs from 'fs';
import { Vocab } from '../models/vocab.model';
import { Sentence } from '../models/sentence.model';
import { textToAudioOneApi } from '../utils/text-to-audio-oneapi';
import { chatGPT } from '../utils/chatGPT';
// import { bcrypt } from 'bcrypt';

export const registerUser = async (req, res, next) => {
   try {
      const { name, username, email, password, confirmPassword } = req.body;
      if (!name && !username && !password && !confirmPassword) {
         return res.status(401).send('Fill required items');
      }
      if (password != confirmPassword) {
         return res.status(401).send('Passwords must be same');
      }
      let user = await User.findOne({ username });
      if (user) res.send({ message: 'This username is already existed' });
      user = new User();
      user.name = name;
      user.username = username;
      user.email = email;
      user.password = password;
      // user.password = await bcrypt.hash(password, 10);
      await user.save();

      res.send({ user, message: 'User registered successfully' });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const signInUser = async (req, res, next) => {
   try {
      const { username, password } = req.body;
      if (!username && !password) {
         return res.status(401).send('Fill required items');
      }
      const user = await User.findOne({ username });
      if (!user)
         return res
            .status(301)
            .send({ message: 'username or password is incorrect 1' });

      const isAuthenticated = await bcrypt.compare(password, user.password);
      if (!isAuthenticated)
         return res
            .status(301)
            .send({ message: 'username or password is incorrect 2' });

      const token = user.generateToken();
      res.status(200).json({
         message: 'Login was successful',
         user,
         token,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getUser = async (req, res, next) => {
   try {
      const { userId } = req;
      const user = await User.findById(userId).select('-password');

      res.send({ user });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getUsers = async (req, res, next) => {
   try {
      const users = await User.find().select('-password');

      res.send({ users });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit User
export const editUser = async (req, res) => {
   try {
      const user = await User.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );

      res.send({
         message: 'User edited successfully',
         user,
      });
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
};

export const syncAllAudio = async (req, res) => {
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
      res.send({ message: 'done' });
   } catch (err) {

      res.status(500).send(err.message);
   }
};

export const syncAllNote = async (req, res) => {
   try {
      const vocabs = await Vocab.find();
      for (let i in vocabs) {
         if (vocabs[i].note == '') {
            vocabs[i].note = await chatGPT(
               `What's the meaning of this word: ${vocabs[i].title}`,
            );
            await vocabs[i].save()
         }
      }

      const sentences = await Sentence.find();
      for (let i in sentences) {
         if (sentences[i].note == '' && sentences[i].type == 'Expression') {
            sentences[i].note = await chatGPT(
               `What's the meaning of this expression: ${sentences[i].context}`,
            );
            await sentences[i].save()
         }
      }
      res.send({ message: 'done' });
   } catch (err) {

      res.status(500).send(err.message);
   }
};
