import { Schema, model } from 'mongoose';

export interface INote {
   title: string;
   direction: string;
   context: string;
   subject: string;
   pics: any[];
   user?: string;
   created_at?: Date;
}

const NoteSchema = new Schema<INote>({
   title: {
      type: String,
      required: true,
   },
   direction: {
      type: String,
   },
   context: {
      type: String,
   },
   subject: {
      type: String,
   },
   // pics: [
   //    {
   //       type: { title: String, url: String },
   //    },
   // ],
   user: {
      type: String,
      ref: 'User',
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

export const Note = model<INote>('Note', NoteSchema);
