import { Schema, model } from 'mongoose';

export interface IVocab {
   title: string;
   _id?: string;
   user?: string;
   meaning?: string;
   phonetics?: string;
   audio?: string;
   type?: string;
   definition?: string;
   example?: string;
   compoundType?: string;
   vocabGroup?: string;
   sentences?: any[];
   is_disable?: Boolean;
   true_guess_count?: number;
   reviewTrueGuessCount?: number;
   dictTrueGuessCount?: number;
   reviewImportance?: boolean;
   dictImportance?: boolean;
   completed?: boolean;
   dictionaryApi?: boolean;
   translateApi?: boolean;
   audioApi?: boolean;
   created_at?: Date;
   dict_last_check_at?: Date;
   review_last_check_at?: Date;
   TTSEngine?: string;
}

export interface IFilterVocab {
   query?: string;
   title?: any;
   phonetics?: any;
   audio?: any;
   type?: any;
   vocabGroup?: string;
   definition?: any;
   example?: any;
   is_disable?: any;
   true_guess_count?: any;
   reviewImportance?: boolean;
   dictImportance?: boolean;
   note?: string;
   user?: string;
   compoundType?: string;
}

const VocabSchema = new Schema<IVocab>({
   title: {
      type: String,
      required: true,
   },
   meaning: {
      type: String,
      null: true,
   },
   phonetics: {
      type: String,
      null: true,
   },
   audio: {
      type: String,
      null: true,
   },
   // Noun, adj, ...
   type: {
      type: String,
      null: true,
   },
   compoundType: {
      type: {
         enum: {
            single: 'Single',
            closed: 'Closed', // e.g: notebook
            hyphenated: 'Hyphenated', // e.g: well-known
            open: 'Open', // e.g: post office
         },
      },
      default: 'Single',
   },
   definition: {
      type: String,
      null: true,
   },
   example: {
      type: String,
      null: true,
   },
   note: {
      type: String,
   },
   is_disable: {
      type: Boolean,
      default: false,
   },
   true_guess_count: {
      type: Number,
      default: 0,
   }, // decommissioned
   reviewTrueGuessCount: {
      type: Number,
      default: 0,
   },
   dictTrueGuessCount: {
      type: Number,
      default: 0,
   },
   dictImportance: {
      type: Boolean,
      default: true,
   },
   reviewImportance: {
      type: Boolean,
      default: true,
   },
   completed: {
      type: Boolean,
      default: false,
   },
   sentences: [
      {
         type: String,
         ref: 'Sentence',
      },
   ],
   vocabGroup: {
      type: String,
      default: null,
      ref: 'VocabGroup',
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
   dict_last_check_at: {
      type: Date,
   },
   review_last_check_at: {
      type: Date,
   },
   user: {
      type: String,
      ref: 'User',
   },
});

export const Vocab = model<IVocab>('Vocab', VocabSchema);
