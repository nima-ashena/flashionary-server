import { Schema, model } from 'mongoose';
import { ISentence } from './sentence.model';

export interface IStory {
   title: string;
   sentences: any[];
   cat: string;
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
   created_at: {
      type: Date,
      default: Date.now,
   },
   category: {
      type: String,
      default: null,
   },
   counterState: {
      type: Number,
      default: 0,
   },
});

export const Story = model<IStory>('Story', StorySchema);
