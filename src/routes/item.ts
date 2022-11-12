import { Router } from 'express';
import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const router = Router();

const prisma = new PrismaClient();

export const createItem = async (req: Request, res: Response) => {
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
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params
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
      where: { id: Number(id) || undefined },
      data: { name, listId, completed },
      include: {
        list: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(400);
    res.json({ error: `Item with ID ${id} does not exist in the database` });
  }
};

export const getItems = async (_: Request, res: Response) => {
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
};

export const getItem = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;

  const item = await prisma.listItem.findUnique({
    where: { id: Number(id) },
    include: {
      list: {
        select: {
          name: true,
        },
      },
    },
  });

  res.json(item);
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await prisma.listItem.delete({
    where: {
      id: Number(id),
    },
  });

  res.json(item);
};

router.post('', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.get('', getItems);
router.get('/:id', getItem);

export default router;
