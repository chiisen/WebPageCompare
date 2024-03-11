import { Injectable } from '@nestjs/common';
import { Builder, Capabilities } from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import { Utils } from "./util";

@Injectable()
export class WebPageCompareService {
  constructor() { }

  /**
   * 為了測試執行結果，可加入 `onApplicationBootstrap()` 方法來執行程式。
   */
  async readWebPage(options?: { gameType: 'slot' }) {
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

      const are_lang = await Utils.findElementClassName(
        driver, 'are_lang', 200, 'click'
      );

      // 點選【繁體中文】選項切換為繁體中文
      const lnk_child = await Utils.findElementText(
        driver, are_lang, '繁體中文', 200, 'click'
      );

      // 點選【電子】
      const li_nav = await driver.findElement(
        By.xpath("//*[contains(text(), '電子')]"),
      );
      li_nav.click();

      // 等待一段時間，確保所有動態生成內容載入完成
      await driver.sleep(2000); // 2000 毫秒為延遲時間（2秒）

      const panel_wrap = await driver.findElement(By.className('panel_wrap'));
      const panel_name = await panel_wrap.findElements(
        By.className('panel_name'),
      );

      let count = 1;
      panel_name.forEach(async (element) => {
        const text = await element.getText();
        console.log(count + ' text: ' + text);
        count += 1;
      });

      // 取得網頁標題並輸出
      const title = await driver.getTitle();
      console.log('網頁標題:', title);

      // 取得網頁內容並輸出
      //const pageSource = await driver.getPageSource();
      //console.log('網頁內容:', pageSource);
    } finally {
      // 等待一段時間，讓人預覽後再關閉瀏覽器
      await driver.sleep(10000); // 10000 毫秒為延遲時間（10秒）

      // 關閉瀏覽器
      await driver.quit();

      // 停止伺服器
      console.log('Server stopped');
      process.exit(0); // 關閉應用程式
    }
  }

  async onApplicationBootstrap() {
    // 呼叫函數來執行讀取網頁的操作
    const slotGameList = await this.readWebPage({ gameType: 'slot' });
    console.log(slotGameList); // slot
  }
}
