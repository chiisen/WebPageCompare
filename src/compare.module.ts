import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebPageCompareService } from './web-page-compare.service';

@Module({
  imports: [HttpModule],
  providers: [WebPageCompareService],
})
export class CompareModule {}
