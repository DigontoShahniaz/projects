import express from 'express';
import diaryRouter from './routes/diaries';
import cors from 'cors';


const app = express();
app.use(cors());

app.use(express.json());

app.use(express.static('dist'));

const PORT = 3000;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});