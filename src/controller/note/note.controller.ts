import { Note, INote } from '../../models/note/note.model';
import { Subject } from '../../models/note/subject.model';

export const getNote = async (req, res, next) => {
   try {
      let note = await Note.findById(req.params.id);

      res.send({
         note,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getNotes = async (req, res, next) => {
   try {
      let notes = await Note.find();

      res.send({
         notes,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addNote = async (req, res, next) => {
   try {
      const { title, context, direction, subjectId } = req.body;

      const subject = await Subject.findById(subjectId);

      if (!subject) {
         res.send({ message: "This subject doesn't exits" });
      }

      const note = new Note();
      note.title = title;
      note.context = context;
      note.direction = direction;
      note.subject = subjectId;
      note.user = req.userId;

      await note.save();

      subject.notes.push(subjectId);
      await subject.save();

      res.send({ note });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit Note
export const editNote = async (req, res, next) => {
   try {
      const note = await Note.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );
      res.send({ note, message: 'Note edited successfully' });
   } catch (err) {
      console.log(err);
      next(err);
   }
};

export const deleteNote = async (req, res, next) => {
   try {
      const note = await Note.findByIdAndDelete(req.params.id);
      // const note = await Note.findById(req.params.id);

      res.send({
         message: 'Note deleted successfully',
         note,
      });
   } catch (err) {
      console.log(err);
      next(err);
   }
};
