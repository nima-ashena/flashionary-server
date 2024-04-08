import { Router } from 'express';

import {
   getNote,
   getNotes,
   addNote,
   editNote,
   deleteNote,
} from '../controller/note/note.controller';
import {
   getSubject,
   getSubjects,
   addSubject,
   editSubject,
   deleteSubject,
} from '../controller/note/subject.controller';
import {
   getCategory,
   getCategories,
   addCategory,
   editCategory,
   deleteCategory,
} from '../controller/note/category.controller';

import { authenticated } from '../middlewares/middleware';

export const router = Router();

// GET Note
router.get('/notes/:id', authenticated, getNote);
// GET Notes
router.get('/notes', authenticated, getNotes);
// Add note
router.post('/notes', authenticated, addNote);
// Edit Note
router.put('/notes/:id', authenticated, editNote);
// Delete Note
router.delete('/notes/:id', authenticated, deleteNote);

//
// GET Subject
router.get('/subjects/:id', authenticated, getSubject);
// GET Subjects
router.get('/subjects', authenticated, getSubjects);
// Add subject
router.post('/subjects', authenticated, addSubject);
// Edit Subject
router.put('/subjects/:id', authenticated, editSubject);
// Delete Subject
router.delete('/subjects/:id', authenticated, deleteSubject);

//
// GET Category
router.get('/categories/:id', authenticated, getCategory);
// GET Categories
router.get('/categories', authenticated, getCategories);
// Add category
router.post('/categories', authenticated, addCategory);
// Edit Category
router.put('/categories/:id', authenticated, editCategory);
// Delete Category
router.delete('/categories/:id', authenticated, deleteCategory);

export default router;
