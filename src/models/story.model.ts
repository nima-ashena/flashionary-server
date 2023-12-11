import { Schema, model } from 'mongoose';
import { ISentence } from './sentence.model';

export interface IStory {
   title: string;
   sentences: any[];
   flags: any[];
   toughs: any[];
   category?: string;
   note?: string;
   noteAudio?: string;
   user?: string;
   created_at?: Date;
}

const StorySchema = new Schema<IStory>({
   title: {
      type: String,
      required: true,
   },
   sentences: [
      {
         type: String,
         ref: 'Sentence',
      },
   ],
   flags: [
      {
         type: String,
         ref: 'Sentence',
      },
   ],
   toughs: [
      {
         type: String,
         ref: 'Sentence',
      },
   ],
   note: {
      type: String,
   },
   noteAudio: {
      type: String,
   },
   category: {
      type: String,
      default: null,
   },
   counterState: {
      type: Number,
      default: 0,
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

export const Story = model<IStory>('Story', StorySchema);
