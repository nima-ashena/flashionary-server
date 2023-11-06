import { Router } from 'express';

import {
   getStory,
   getStories,
   addStory,
   addSentenceToStory,
   deleteSentenceOfStory,
   editStory,
   deleteStory,
} from '../controller/story.controller';
import { authenticated } from '../middlewares/middleware';

export const router = Router();

// GET Story
router.get('/stories/:id', authenticated, getStory);
// GET Stories
router.get('/stories', authenticated, getStories);
// Add story
router.post('/stories', authenticated, addStory);
// Add sentence to story
router.post('/stories/add-sentence', authenticated, addSentenceToStory);
// Delete Sentence of Story
router.post('/stories/delete-sentence', authenticated, deleteSentenceOfStory);
// Edit Story
router.put('/stories/:id', authenticated, editStory);
// Delete Story
router.delete('/stories/:id', authenticated, deleteStory);

export default router;
