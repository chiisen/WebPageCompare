import { Injectable } from '@nestjs/common';
import { Builder, Capabilities } from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import { Utils } from './util';
import * as XLSX from 'xlsx';

@Injectable()
export class WebPageCompareService {
  constructor() {}

  /**
   * 為了測試執行結果，可加入 `onApplicationBootstrap()` 方法來執行程式。
   */
  async readWebPage(options?: { gameType: 'slot' }) {
    // 讀取 Excel 檔案
    const workbook = XLSX.readFile('GameList.xlsx');

    // 獲取第一個工作表
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];

    // 將工作表轉換為 JSON 對象
    const data = XLSX.utils.sheet_to_json(worksheet);

    const map = new Map();
    data.forEach((element, index) => {
      const gameName = (element as { gameName: string }).gameName;
      if (map.has(gameName)) {
        throw new Error(`Map already contain the key(${gameName}).`);
      } else {
        map.set(gameName, index);
      }
    });

    // 創建一個 WebDriver 實例，這裡使用 Chrome 瀏覽器
    const driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .build();

    // 設定視窗解析度為 1920x1080
    await driver.manage().window().setRect({ width: 1920, height: 1080 });

    const selectType = options?.gameType ?? 'slot';
    const url = {
      slot: 'https://ts.bacctest.com/',
    };
    try {
      // 前往指定的網頁
      const selectUrl = url[selectType];
      await driver.get(selectUrl);

      // 等待一段時間，確保所有動態生成內容載入完成
      await driver.sleep(2000); // 2000 毫秒為延遲時間（2秒）

      const are_lang = await Utils.findAllClassName(
        driver,
        'are_lang',
        200,
        'click',
      );

      // 點選【繁體中文】選項切換為繁體中文
      await Utils.findElementText(driver, are_lang, '繁體中文', 200, 'click');

      // 點選【電子】
      await Utils.findAllText(driver, '電子', 200, 'click');

      const panel_wrap = await Utils.findAllClassName(
        driver,
        'panel_wrap',
        1,
        '',
      );

      const panel_name = await panel_wrap.findElements(
        By.className('panel_name'),
      );

      let count = 1;
      for (const element of panel_name) {
        const text = await element.getText();

        if (map.has(text)) {
          const index = map.get(text);
          const nowIndex = index + 1;
          if (nowIndex != count) {
            console.log(
              `text: ${text} 排序錯誤 Excel=${nowIndex}, 遊戲畫面=${count}`,
            );
          } else {
            console.log(`${count} text: ${text} 正確✅`);
          }
        } else {
          console.log(`text: ${text} 不存在`);
        }

        count += 1;
      }

      // 取得網頁標題並輸出
      const title = await driver.getTitle();
      console.log('網頁標題:', title);

      // 取得網頁內容並輸出
      //const pageSource = await driver.getPageSource();
      //console.log('網頁內容:', pageSource);
    } finally {
      // 關閉瀏覽器
      await driver.quit();

      // 關閉伺服器
      console.log('關閉伺服器');
      process.exit(0); // 關閉應用程式
    }
  }

  async onApplicationBootstrap() {
    // 呼叫函數來執行讀取網頁的操作
    const slotGameList = await this.readWebPage({ gameType: 'slot' });
    console.log(slotGameList); // slot
  }
}
