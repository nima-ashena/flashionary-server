import { Schema, model } from 'mongoose';

export interface ISubject {
   title: string;
   notes: any[];
   user?: string;
   created_at?: Date;
}

const SubjectSchema = new Schema<ISubject>({
   title: {
      type: String,
      required: true,
   },
   notes: [
      {
         type: String,
         ref: 'Note',
      },
   ],
   user: {
      type: String,
      ref: 'User',
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
});

export const Subject = model<ISubject>('Subject', SubjectSchema);
