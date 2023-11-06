import { Router } from 'express';

import vocabRouter from './vocab.router';
import sentencesRouter from './sentence.router';
import storiesRouter from './story.router';
import userRouter from './user.router';
import { authenticated } from '../middlewares/middleware';

const router = Router();

router.use(userRouter);
router.use(vocabRouter);
router.use(sentencesRouter);
router.use(storiesRouter);
// router.use(authenticated, vocabRouter);
// router.use(authenticated, sentencesRouter);
// router.use(authenticated, storiesRouter);

export default router;
