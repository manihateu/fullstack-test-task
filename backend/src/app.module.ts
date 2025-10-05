import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IdeasModule } from './ideas/ideas.module';
import { IpMiddleware } from './common/ip.middleware';

@Module({
  imports: [PrismaModule, IdeasModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
  }
}
