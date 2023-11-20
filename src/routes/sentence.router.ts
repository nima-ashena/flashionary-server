import { Router } from 'express';

import {
   getSentence,
   getSentences,
   addSentences,
   editSentence,
   deleteSentence,
   plusTrueSentences,
   syncSentenceAudio,
   cloneSentence,
} from '../controller/sentence.controller';
import { authenticated } from '../middlewares/middleware';

export const router = Router();

// GET sentence
router.get('/sentences/:id', authenticated, getSentence);
// Get sentences
router.get('/sentences', authenticated, getSentences);
// Add sentence
router.post('/sentences', authenticated, addSentences);
// Edit sentence
router.put('/sentences/:id', authenticated, editSentence);
// Delete sentence
router.delete('/sentences/:id', authenticated, deleteSentence);
// plus true guess sentences
router.post('/sentences/plus-true-guess/:id', authenticated, plusTrueSentences);
// sync sentence audio
router.post('/sentences/sync-sentence-audio', authenticated, syncSentenceAudio);
// Clone Sentence
router.post('/sentences/clone', authenticated, cloneSentence);

export default router;
