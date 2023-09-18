import { Express, Request, Response } from 'express';

enum HealthStatus {
  Healthy = 'healthy',
  Warning = 'warn',
  Error = 'error',
}

type HealthResponse = {
  status: HealthStatus;
  message: string;
};

export function getHealthStatus(_req: Request, res: Response) {
  const health: HealthResponse = {
    status: HealthStatus.Healthy,
    message: 'Service is operating normally',
  };

  res.status(health.status === HealthStatus.Error ? 500 : 200).json(health);
}

export function configureHealthCheckRoute(app: Express) {
  app.get('/', getHealthStatus);
}
