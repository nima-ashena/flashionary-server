import { Router } from 'express';

import {
   getVocabGroup,
   getVocabGroups,
   addVocabGroup,
   addVocabToVocabGroup,
   deleteVocabOfVocabGroup,
   editVocabGroup,
   deleteVocabGroup,
} from '../controller/vocabGroup.controller';
import { authenticated } from '../middlewares/middleware';

export const router = Router();

// GET VocabGroup
router.get('/vocab-groups/:id', authenticated, getVocabGroup);
// GET Vocab-groups
router.get('/vocab-groups', authenticated, getVocabGroups);
// Add vocabGroup
router.post('/vocab-groups', authenticated, addVocabGroup);
// Add vocab to vocabGroup
router.post('/vocab-groups/add-vocab', authenticated, addVocabToVocabGroup);
// Delete Vocab of VocabGroup
router.post(
   '/vocab-groups/delete-vocab',
   authenticated,
   deleteVocabOfVocabGroup,
);
// Edit VocabGroup
router.put('/vocab-groups/:id', authenticated, editVocabGroup);
// Delete VocabGroup
router.delete('/vocab-groups/:id', authenticated, deleteVocabGroup);

export default router;
