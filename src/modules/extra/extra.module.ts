import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraController } from './extra.controller';
import { DomainService } from '../domain/domain.service';
import { Domain } from '../domain/domain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Domain])],
  controllers: [ExtraController],
  providers: [],
  exports: [],
})
export class ExtraModule {}