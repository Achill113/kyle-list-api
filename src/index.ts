import express from 'express';
import cors from 'cors';
import listRouter from './routes/list';
import itemRouter from './routes/item';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', async (_, res) => {
  res.send(`I'm alive`);
});

app.use('/list', listRouter);

app.use('/item', itemRouter);

const port = 5000;

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`),
);
