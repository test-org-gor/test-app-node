import { Router, Request, Response } from 'express';

const router = Router();

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  memory: {
    used: number;
    total: number;
  };
}

router.get('/', (_req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  
  const health: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
    },
  };

  res.json(health);
});

router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

router.get('/ready', (_req: Request, res: Response) => {
  // Add readiness checks here (DB, cache, etc.)
  res.status(200).json({ status: 'ready' });
});

export { router as healthRouter };
