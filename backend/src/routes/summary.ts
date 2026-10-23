import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/authenticate';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const [totalAgg, overdueCount, upcomingCount] = await Promise.all([
    prisma.loan.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.loan.count({ where: { userId, status: 'OVERDUE' } }),
    prisma.loan.count({ where: { userId, status: 'UNPAID', dueDate: { lt: new Date() } } }),
  ]);
  const totalLent = totalAgg._sum.amount ?? 0;
  res.json({ totalLent, overdueCount, overdueLoans: upcomingCount });
});

export default router;
