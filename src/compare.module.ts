import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebPageCompareService } from './web-page-compare.service';
import { WebComparePromotionService } from './web-compare-promotion.service';

@Module({
  imports: [HttpModule],
  providers: [WebPageCompareService, WebComparePromotionService],
})
export class CompareModule {}
