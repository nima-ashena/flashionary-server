import { Category } from '../../models/note/category.model';
import { Subject, ISubject } from '../../models/note/subject.model';

export const getSubject = async (req, res, next) => {
   try {
      let subject = await Subject.findById(req.params.id);

      if (!subject) {
         res.send({ message: "This subject doesn't exits" });
      }

      res.send({
         subject,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getSubjects = async (req, res, next) => {
   try {
      let subjects = await Subject.find();

      res.send({
         subjects,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addSubject = async (req, res, next) => {
   try {
      const { title, catId } = req.body;

      const category = await Category.findById(catId);
      if (!category) {
         res.send({ message: "This category doesn't exits" });
      }

      const subject = new Subject();
      subject.title = title;
      subject.user = req.userId;
      await subject.save();

      category.subjects.push(subject._id);
      await category.save();

      res.send({ subject });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit Subject
export const editSubject = async (req, res, next) => {
   try {
      const subject = await Subject.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );
      res.send({ subject, message: 'Subject edited successfully' });
   } catch (err) {
      console.log(err);
      next(err);
   }
};

export const deleteSubject = async (req, res, next) => {
   try {
      const subject = await Subject.findByIdAndDelete(req.params.id);
      // const subject = await Subject.findById(req.params.id);

      res.send({
         message: 'Subject deleted successfully',
         subject,
      });
   } catch (err) {
      console.log(err);
      next(err);
   }
};
