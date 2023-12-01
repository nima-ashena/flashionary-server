import { Schema, model } from 'mongoose';

export interface IVocabGroup {
   title: string;
   _id?: string;
   user?: string;
   groupKind?: string;
   vocabs?: any[];
   created_at?: Date;
}

export interface IFilterVocabGroup {
   query?: string;
   title?: any;
   phonetics?: any;
   audio?: any;
   type?: any;
   definition?: any;
   example?: any;
   is_disable?: any;
   true_guess_count?: any;
   note?: string;
   user?: string;
}

const VocabGroupSchema = new Schema<IVocabGroup>({
   title: {
      type: String,
      required: true,
   },
   groupKind: {
      type: {
         enum: {
            synonym: 'Synonym',
            antonym: 'Antonym',
            dictation: 'Dictation',
            pronunciation: 'Pronunciation',
            confusing: 'Confusing',
            other: 'Other',
         },
      },
   },
   vocabs: [
      {
         type: String,
         ref: 'Vocab',
      },
   ],
   note: {
      type: String,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
   user: {
      type: String,
      ref: 'User',
   },
});

export const VocabGroup = model<IVocabGroup>('VocabGroup', VocabGroupSchema);
