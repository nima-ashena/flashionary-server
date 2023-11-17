import { Schema, model } from 'mongoose';
import { ISentence } from './sentence.model';

export interface IStory {
   title: string;
   sentences: any[];
   cat?: string;
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
