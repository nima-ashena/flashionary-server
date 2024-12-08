import { Vocab } from "../../models/vocab.model";
import { chatGPT } from "../chatGPT";
import { Sentence } from "../../models/sentence.model";


export const syncAllNotes = async () => {
   try {
      const vocabs = await Vocab.find();
      for (let i in vocabs) {
         if (vocabs[i].note == '') {
            vocabs[i].note = await chatGPT(
               `What's the meaning of this word: ${vocabs[i].title}`,
            );
            await vocabs[i].save()
         }
      }

      const sentences = await Sentence.find();
      for (let i in sentences) {
         if (sentences[i].note == '' && sentences[i].type == 'Expression') {
            sentences[i].note = await chatGPT(
               `What's the meaning of this expression: ${sentences[i].context}`,
            );
            await sentences[i].save()
         }
      }

   } catch (err) {
      console.log(err);

   }
};