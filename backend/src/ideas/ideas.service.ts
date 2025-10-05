import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdeasService {
  constructor(private prisma: PrismaService) {}

  async listIdeasWithVoteFlag(ip: string) {
    const ideas = await this.prisma.idea.findMany({
      orderBy: { votesCount: 'desc' },
    });

    const votes = await this.prisma.vote.findMany({
      where: { ip },
      select: { ideaId: true },
    });
    const votedSet = new Set(votes.map(v => v.ideaId));
    return ideas.map(i => ({ ...i, voted: votedSet.has(i.id) }));
  }

  async vote(ideaId: number, ip: string) {
    const idea = await this.prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) throw new NotFoundException('Идея не найдена');

    const existing = await this.prisma.vote.findUnique({
      where: { ip_ideaId: { ip, ideaId } } as any,
    }).catch(() => null);

    if (existing) {
      throw new ConflictException('Голос за эту идею уже был дан с этого IP');
    }

    const count = await this.prisma.vote.count({ where: { ip } });
    if (count >= 10) {
      throw new ConflictException('Лимит голосов (10) исчерпан для этого IP');
    }

    const [vote] = await this.prisma.$transaction([
      this.prisma.vote.create({ data: { ip, ideaId } }),
      this.prisma.idea.update({
        where: { id: ideaId },
        data: { votesCount: { increment: 1 } },
      }),
    ]);
    return vote;
  }
}
