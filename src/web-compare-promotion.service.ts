import { Injectable } from '@nestjs/common';
import { Builder, Capabilities } from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import { Utils } from './util';
import * as XLSX from 'xlsx';
@Injectable()
export class WebComparePromotionService {
  async readWebPage() {
    const driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .build();
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    const url = 'https://ts.bacctest.com/';
    await driver.get(url);
    await driver.sleep(1000);
    const workbook = XLSX.readFile('promotionList.xlsx');
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[3]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    try {
      const are_lang = await Utils.findAllClassName(
        driver,
        'are_lang',
        200,
        'click',
      );
      await Utils.findElementText(driver, are_lang, '繁體中文', 200, 'click');
      await driver.sleep(1000);
      await Utils.findAllText(driver, '活動消息', 200, 'click');
      await driver.sleep(1000);
      const aside_list = await Utils.findAllClassName(
        driver,
        'aside_list',
        200,
        '',
      );
      await Utils.findElementText(driver, aside_list, '真人消息', 200, 'click');

      const blk_promotion = await Utils.findAllClassName(
        driver,
        'blk_promotion',
        200,
        '',
      );
      const lnk_promotion = await blk_promotion.findElements(
        By.className('lnk_promotion'),
      );

      const fcRepeatCheck = async () => {
        const map = new Map<any, any>();
        let cleanedPromotionData = '';
        data.slice(1).forEach((element) => {
          const promotionData = (element as { ['zh-Hant'] })['zh-Hant'];
          cleanedPromotionData = promotionData.replace(
            /(\r\n|\n|\r|\s+)/gm,
            '',
          );
          if (map.has(cleanedPromotionData)) {
            throw new Error(`重複標題: ${promotionData}`);
          } else {
            map.set(cleanedPromotionData, cleanedPromotionData);
          }
        });

        for (const promotion of lnk_promotion) {
          await promotion.click();
          await driver.sleep(1000);
          const box_wrapper = await Utils.findAllClassName(
            driver,
            'box_wrapper',
            200,
            '',
          );
          const promotionTitle = await box_wrapper.findElements(
            By.className('h1_title'),
          );
          const promotionContent = await box_wrapper.findElements(
            By.className('p_promoText'),
          );

          const promotionTitleText = await promotionTitle[0].getText();
          const promotionContentText = await promotionContent[0].getText();

          const content: any =
            promotionTitleText.replace(/(\r\n|\n|\r|\s+)/gm, '') +
            promotionContentText.replace(/(\r\n|\n|\r|\s+)/gm, '');

          if (map.has(content)) {
            console.log(`content: ${content} 正確✅`);
          } else {
            console.log(`content: ${content} 錯誤❌`);
          }
          const box = await box_wrapper.findElement(By.className('box_close'));
          await box.click();
          await driver.sleep(1000);
        }
      };
      await driver.sleep(1000);
      await fcRepeatCheck();
    } catch (e) {
      console.error(e);
    } finally {
      await driver.quit();

      // 關閉伺服器
      console.log('關閉伺服器');
      process.exit(0); // 關閉應用程式
    }
  }
  async onApplicationBootstrap() {
    // 呼叫函數來執行讀取網頁的操作
    await this.readWebPage();
  }
}
