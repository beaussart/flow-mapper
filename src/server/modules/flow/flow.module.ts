import { Module } from '@nestjs/common';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { FlowApp } from '../flow-app/flow-app.entity';
import { FlowAppModule } from '../flow-app/flow-app.module';
import { FlowTechnoModule } from '../flow-techno/flow-techno.module';
import { FlowAppService } from '../flow-app/flow-app.service';
import { FlowTechnoService } from '../flow-techno/flow-techno.service';
import { SearchModule } from '../core/search/search.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flow } from './flow.entity';
import { FlowRepository } from './flow.repository';
import { FlowTechnoOrder } from './flow-techno-order.entity';

@Module({
  controllers: [FlowController],
  providers: [FlowService],
  imports: [
    FlowAppModule,
    FlowTechnoModule,
    FlowAppModule,
    SearchModule,
    TypeOrmModule.forFeature([Flow, FlowRepository, FlowTechnoOrder]),
  ],
})
export class FlowModule {}
