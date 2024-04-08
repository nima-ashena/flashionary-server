import { Schema, model } from 'mongoose';

export interface ICategory {
   title: string;
   subjects: any[];
   user?: string;
   pic?: string;
   created_at?: Date;
}

const CategorySchema = new Schema<ICategory>({
   title: {
      type: String,
      required: true,
   },
   subjects: [
      {
         type: String,
         ref: 'Subjects',
      },
   ],
   pic: {
      type: String,
   },
   user: {
      type: String,
      ref: 'User',
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

export const Category = model<ICategory>('Category', CategorySchema);
