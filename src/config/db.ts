import { connect } from 'mongoose';

export const connectDb = async () => {
   try {
      await connect('mongodb://127.0.0.1:27017/flashionary', {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: true,
      });

      console.log(`MongoDB Connected \n`);
   } catch (err) {
      console.log(err);
      process.exit(1);
   }
};
