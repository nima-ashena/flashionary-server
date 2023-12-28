// import { router } from './dashboard-routes';
import { Router } from 'express';

import {
   getVocab,
   getVocabs,
   addVocab,
   editVocab,
   deleteVocab,
   pulsTrueVocab,
   syncVocabAudio,
   addSentenceToVocab,
   addVocabToVocab,
   deleteSentenceOfVocab,
   cloneVocab,
} from '../controller/vocab.controller';
import { authenticated } from '../middlewares/middleware';

export const router = Router();

// GET Vocab
router.get('/vocabs/:id', authenticated, getVocab);
// GET Vocabs
router.get('/vocabs', authenticated, getVocabs);
// Add vocab
router.post('/vocabs', authenticated, addVocab);
// Edit Vocab
router.put('/vocabs/:id', authenticated, editVocab);
// Delete Vocab
router.delete('/vocabs/:id', authenticated, deleteVocab);
// plus true guess
router.post('/vocabs/plus-true-guess', authenticated, pulsTrueVocab);
// sync vocab audio
router.post('/vocabs/sync-vocab-audio', authenticated, syncVocabAudio);
// Add sentence to vocab
router.post('/vocabs/add-sentence', authenticated, addSentenceToVocab);
// Add vocab to vocab
router.post('/vocabs/add-vocab', authenticated, addVocabToVocab);
// Delete sentence of vocab
router.post('/vocabs/delete-sentence', authenticated, deleteSentenceOfVocab);
// Clone Vocab
router.post('/vocabs/clone', authenticated, cloneVocab);

export default router;
