import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '../utils/errors';

const router = Router();

// Validation schemas
const createItemSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  quantity: z.number().int().min(0).default(0),
  category: z.string().optional(),
});

const updateItemSchema = createItemSchema.partial();

// In-memory store
interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const items: Map<string, Item> = new Map();
let idCounter = 1;

// List all items
router.get('/', (_req: Request, res: Response) => {
  const itemList = Array.from(items.values());
  res.json({
    data: itemList,
    total: itemList.length,
  });
});

// Get single item
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const item = items.get(req.params.id);
  if (!item) {
    return next(new NotFoundError(`Item ${req.params.id} not found`));
  }
  res.json({ data: item });
});

// Create item
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const result = createItemSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ValidationError(result.error.message));
  }

  const id = String(idCounter++);
  const now = new Date();
  const item: Item = {
    id,
    ...result.data,
    createdAt: now,
    updatedAt: now,
  };

  items.set(id, item);
  res.status(201).json({ data: item });
});

// Update item
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  const item = items.get(req.params.id);
  if (!item) {
    return next(new NotFoundError(`Item ${req.params.id} not found`));
  }

  const result = updateItemSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ValidationError(result.error.message));
  }

  const updated: Item = {
    ...item,
    ...result.data,
    updatedAt: new Date(),
  };

  items.set(req.params.id, updated);
  res.json({ data: updated });
});

// Delete item
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!items.has(req.params.id)) {
    return next(new NotFoundError(`Item ${req.params.id} not found`));
  }

  items.delete(req.params.id);
  res.status(204).send();
});

// For testing - reset store
export const resetItems = (): void => {
  items.clear();
  idCounter = 1;
};

export { router as itemsRouter };
