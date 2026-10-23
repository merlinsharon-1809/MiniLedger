import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const loanCreateSchema = z.object({
  friendName: z.string().min(1),
  amount: z.coerce.number().positive(),
  dueDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  notes: z.string().optional(),
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const parse = loanCreateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.errors });
  }
  const { friendName, amount, dueDate, notes } = parse.data;
  const loan = await prisma.loan.create({
    data: {
      friendName,
      amount,
      dueDate: new Date(dueDate),
      notes,
      userId: req.user!.id,
    },
  });
  res.status(201).json(loan);
});

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const loans = await prisma.loan.findMany({
    where: { userId: req.user!.id },
    orderBy: { dueDate: 'asc' },
  });
  res.json(loans);
});

const loanUpdateSchema = z.object({
  status: z.enum(['UNPAID', 'PAID', 'OVERDUE']).optional(),
  receiptPath: z.string().optional(),
}).partial();

router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const parse = loanUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.errors });
  }
  const data: any = { ...parse.data };
  if (data.status === 'PAID') {
    data.repaidAt = new Date();
  }
  const loan = await prisma.loan.update({
    where: { id, userId: req.user!.id },
    data,
  });
  res.json(loan);
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await prisma.loan.delete({ where: { id, userId: req.user!.id } });
  res.status(204).send();
});

export default router;
