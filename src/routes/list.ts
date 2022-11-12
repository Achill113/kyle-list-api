import { Router } from 'express';
import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const router = Router();

const prisma = new PrismaClient();

export const createList = async (req: Request, res: Response) => {
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
};

export const updateList = async (req: Request, res: Response) => {
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
};

export const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;

  const list = await prisma.list.delete({
    where: {
      id: Number(id),
    },
  });

  res.json(list);
};

export const getLists = async (_: Request, res: Response) => {
  const lists = await prisma.list.findMany({
    include: {
      listItems: true
    }
  });

  res.json(lists);
};

export const getList = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;

  const list = await prisma.list.findUnique({
    where: { id: Number(id) },
    include: {
      listItems: true,
    },
  });

  res.json(list);
};

router.post('', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);
router.get('', getLists);
router.get('/:id', getList);

export default router;
