import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '../utils/errors';

const router = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
});

const updateUserSchema = createUserSchema.partial();

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

const users: Map<string, User> = new Map();
let idCounter = 1;

router.get('/', (req: Request, res: Response) => {
  const { role } = req.query;
  let userList = Array.from(users.values());
  if (role && typeof role === 'string') {
    userList = userList.filter((u) => u.role === role);
  }
  res.json({ data: userList, total: userList.length });
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const user = users.get(req.params.id);
  if (!user) return next(new NotFoundError(`User ${req.params.id} not found`));
  res.json({ data: user });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) return next(new ValidationError(result.error.message));
  const existing = Array.from(users.values()).find((u) => u.email === result.data.email);
  if (existing) return next(new ValidationError('Email already exists'));
  const id = String(idCounter++);
  const user: User = { id, ...result.data, createdAt: new Date() };
  users.set(id, user);
  res.status(201).json({ data: user });
});

router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  const user = users.get(req.params.id);
  if (!user) return next(new NotFoundError(`User ${req.params.id} not found`));
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) return next(new ValidationError(result.error.message));
  const updated: User = { ...user, ...result.data };
  users.set(req.params.id, updated);
  res.json({ data: updated });
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!users.has(req.params.id)) {
    return next(new NotFoundError(`User ${req.params.id} not found`));
  }
  users.delete(req.params.id);
  res.status(204).send();
});

export const resetUsers = (): void => {
  users.clear();
  idCounter = 1;
};

export { router as usersRouter };
