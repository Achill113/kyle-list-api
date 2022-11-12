import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', async (_, res) => {
  res.send(`I'm alive`);
});

app.post(`/list`, async (req, res) => {
  const { name } = req.body;

  if (name === undefined) {
    res.status(400);
    res.json({ error: 'name is required.' });
    return;
  }

  const result = await prisma.list.create({
    data: {
      name,
    },
  });

  res.json(result);
});

app.put('/list/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body;

  if (name === undefined) {
    res.status(400);
    res.json({ error: 'name is required.' });
    return;
  }

  try {
    const updatedList = await prisma.list.update({
      where: { id: Number(id) || undefined },
      data: { name },
    });

    res.json(updatedList);
  } catch (error) {
    res.status(400);
    res.json({ error: `List with ID ${id} does not exist in the database` });
  }
});

app.delete(`/list/:id`, async (req, res) => {
  const { id } = req.params;

  const list = await prisma.list.delete({
    where: {
      id: Number(id),
    },
  });

  res.json(list);
});

app.get('/list', async (_, res) => {
  const lists = await prisma.list.findMany({
    include: {
      listItems: true
    }
  });

  res.json(lists);
});

app.get(`/list/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  const list = await prisma.list.findUnique({
    where: { id: Number(id) },
    include: {
      listItems: true,
    },
  });

  res.json(list);
});

app.post(`/item`, async (req, res) => {
  const { name, listId } = req.body;

  if (name === undefined) {
    res.status(400);
    res.json({ error: 'name is required.' });
    return;
  }

  if (listId === undefined) {
    res.status(400);
    res.json({ error: 'listId is required.' });
    return;
  }
  
  const result = await prisma.listItem.create({
    data: {
      name,
      listId: Number(listId),
      completed: false,
    },
  });

  res.json(result);
});

app.put('/item/:itemId', async (req, res) => {
  const { itemId } = req.params
  const { name, listId, completed }: { name?: string, listId?: number, completed?: boolean } = req.body;

  if (name === undefined) {
    res.status(400);
    res.json({ error: 'name is required.' });
    return;
  }

  if (listId === undefined) {
    res.status(400);
    res.json({ error: 'listId is required.' });
    return;
  }

  if (completed === undefined) {
    res.status(400);
    res.json({ error: 'completed is required.' });
    return;
  }

  try {
    const updatedItem = await prisma.listItem.update({
      where: { id: Number(itemId) || undefined },
      data: { name, listId, completed },
      include: {
        list: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(400);
    res.json({ error: `Item with ID ${itemId} does not exist in the database` });
  }
});

app.get(`/item`, async (_, res) => {
  const items = await prisma.listItem.findMany({
    include: {
      list: {
       select : {
        name: true,
       },
      },
    },
  });

  res.json(items);
});

app.get(`/item/:itemId`, async (req, res) => {
  const { itemId }: { itemId: string } = req.params;

  const item = await prisma.listItem.findUnique({
    where: { id: Number(itemId) },
    include: {
      list: {
        select: {
          name: true,
        },
      },
    },
  });

  res.json(item);
});

app.delete(`/item/:itemId`, async (req, res) => {
  const { itemId } = req.params;

  const item = await prisma.listItem.delete({
    where: {
      id: Number(itemId),
    },
  });

  res.json(item);
});

const port = 5000;

const server = app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`),
);
