import { Schema, model } from 'mongoose';

export interface ISentence {
   context: string;
   meaning: string;
   note: string;
   audio: string;
   is_disable: Boolean;
   true_guess_count: Number;
   created_at?: Date;
   last_check_at?: Date;
   story: string;
   vocab: string;
   user: string;
   type: string;
   TTSEngine: string;
}

export interface IFilterSentence {
   query?: string;
   context?: any;
   audio?: any;
   type?: any;
   is_disable?: any;
   true_guess_count?: any;
   story?: any;
   user?: string;
}

const SentenceSchema = new Schema<ISentence>({
   context: {
      type: String,
      required: true,
   },
   meaning: {
      type: String,
      null: true,
   },
   note: {
      type: String,
      null: true,
   },
   audio: {
      type: String,
      null: true,
   },
   true_guess_count: {
      type: Number,
      default: 0,
   },
   is_disable: {
      type: Boolean,
      default: false,
   },
   created_at: {
      type: Date,
      default: Date.now,
   },
   story: {
      type: String,
      default: null,
      ref: 'Story',
   },
   vocab: {
      type: String,
      default: null,
      ref: 'Vocab',
   },
   user: {
      type: String,
      ref: 'User',
   },
   type: {
      type: String,
      default: 'Simple',
   },
   last_check_at: {
      type: Date,
   },
});

export const Sentence = model<ISentence>('Sentence', SentenceSchema);
