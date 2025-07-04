import { Schema, model } from 'mongoose';

export interface ISentence {
   context: string;
   meaning: string;
   note: string;
   noteAudio?: string;
   audio: string;
   is_disable: Boolean;
   true_guess_count: number;
   reviewTrueGuessCount?: number;
   replacementTrueGuessCount?: number;
   dictTrueGuessCount?: number;
   reviewImportance?: boolean;
   replacementImportance?: boolean;
   dictImportance?: boolean;
   created_at?: Date;
   replacement_last_check_at?: Date;
   review_last_check_at?: Date;
   dict_last_check_at?: Date;
   story: string;
   vocab: string;
   user: string;
   type: string;
   TTSEngine: string;
   storyFlag?: string;
   storyTough?: string;
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
   reviewImportance?: boolean;
   replacementImportance?: boolean;
   dictImportance?: boolean;
   reviewTrueGuessCount?: any;
   replacementTrueGuessCount?: any;
   dictTrueGuessCount?: any;
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
   noteAudio: {
      type: String,
   },
   true_guess_count: {
      type: Number,
      default: 0,
   }, // decommissioned
   reviewTrueGuessCount: {
      type: Number,
      default: 0,
   },
   reviewImportance: {
      type: Boolean,
      default: true,
   },
   replacementTrueGuessCount: {
      type: Number,
      default: 0,
   },
   replacementImportance: {
      type: Boolean,
      default: true,
   },
   dictImportance: {
      type: Boolean,
      default: true,
   },
   dictTrueGuessCount: {
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
   storyFlag: {
      type: Boolean,
   },
   storyTough: {
      type: Boolean,
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
   review_last_check_at: {
      type: Date,
   },
   replacement_last_check_at: {
      type: Date,
   },
   dict_last_check_at: {
      type: Date,
   },
});

export const SentenceTypes = ['Simple', 'Expression', 'SemanticPoint', 'Other'];

export const Sentence = model<ISentence>('Sentence', SentenceSchema);
