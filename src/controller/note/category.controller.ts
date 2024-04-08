import { Category, ICategory } from '../../models/note/category.model';

export const getCategory = async (req, res, next) => {
   try {
      let category = await Category.findById(req.params.id);

      res.send({
         category,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const getCategories = async (req, res, next) => {
   try {
      let categories = await Category.find();

      res.send({
         categories,
      });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

export const addCategory = async (req, res, next) => {
   try {
      const { title } = req.body;
      const category = new Category();
      category.title = title;
      category.user = req.userId;

      await category.save();
      res.send({ category });
   } catch (e) {
      console.log(e);
      next(e);
   }
};

// Edit Category
export const editCategory = async (req, res, next) => {
   try {
      const category = await Category.findByIdAndUpdate(
         req.params.id,
         { ...req.body },
         { new: true },
      );
      res.send({ category, message: 'Category edited successfully' });
   } catch (err) {
      console.log(err);
      next(err);
   }
};

export const deleteCategory = async (req, res, next) => {
   try {
      const category = await Category.findByIdAndDelete(req.params.id);
      // const category = await Category.findById(req.params.id);

      res.send({
         message: 'Category deleted successfully',
         category,
      });
   } catch (err) {
      console.log(err);
      next(err);
   }
};
