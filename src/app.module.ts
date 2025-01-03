import { Module, OnApplicationBootstrap } from '@nestjs/common';
// 透過 `nest g service twse-scraper --flat --no-spec` 建立的 twse-scraper.service 服務，與 `scraper` 目錄的 twse-scraper.service 服務才能正確執行
import { WebPageCompareService } from './web-page-compare.service';
import { HttpModule } from '@nestjs/axios';
import { WebComparePromotionService } from './web-compare-promotion.service';

@Module({
  imports: [HttpModule],
  providers: [HttpModule, WebPageCompareService, WebComparePromotionService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly webPageCompareService: WebPageCompareService,
    private readonly webComparePromotionService: WebComparePromotionService,
  ) {}
  async onApplicationBootstrap() {
    await this.webPageCompareService.readWebPage();
    // await this.webComparePromotionService.readWebPage();
  }
}
