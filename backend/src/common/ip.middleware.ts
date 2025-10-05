import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const xff = req.header('x-forwarded-for');
    let ip = '';
    if (xff && xff.length) {
      ip = xff.split(',')[0].trim();
    } else if (req.ip) {
      ip = req.ip;
    } else if ((req as any).socket?.remoteAddress) {
      ip = (req as any).socket.remoteAddress;
    }
    (req as any).clientIp = ip;
    next();
  }
}
