import { Router } from 'express';

import vocabRouter from './vocab.router';
import sentencesRouter from './sentence.router';
import storiesRouter from './story.router';
import userRouter from './user.router';
import vocabGroupRouter from './vocabGroup.router';
import noteRouter from './note.router';

const router = Router();

router.use(userRouter);
router.use(vocabRouter);
router.use(sentencesRouter);
router.use(storiesRouter);
router.use(vocabGroupRouter);
router.use(noteRouter);

export default router;
