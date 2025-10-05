import { Controller, Get, Post, Param, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { IdeasService } from './ideas.service';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly svc: IdeasService) {}

  @Get()
  async list(@Req() req: Request) {
    const ip = (req as any).clientIp || '';
    return this.svc.listIdeasWithVoteFlag(ip);
  }

  @Post(':id/vote')
  async vote(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const ip = (req as any).clientIp || '';
    return this.svc.vote(Number(id), ip);
  }
}
