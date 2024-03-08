import { Module } from '@nestjs/common';
import { CompareModule } from './compare.module';
// 透過 `nest g service twse-scraper --flat --no-spec` 建立的 twse-scraper.service 服務，與 `scraper` 目錄的 twse-scraper.service 服務才能正確執行
import { WebPageCompareService } from './web-page-compare.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CompareModule],
  providers: [HttpModule, WebPageCompareService],
})
export class AppModule {}
