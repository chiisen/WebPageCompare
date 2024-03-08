import { Injectable } from '@nestjs/common';
import { Builder, Capabilities } from 'selenium-webdriver';

@Injectable()
export class WebPageCompareService {
  constructor() {}

  /**
   * 為了測試執行結果，可加入 `onApplicationBootstrap()` 方法來執行程式。
   */
  async readWebPage(options?: { gameType: 'slot' | 'fish' }) {
    // 創建一個 WebDriver 實例，這裡使用 Chrome 瀏覽器
    const driver = await new Builder()
      .withCapabilities(Capabilities.chrome())
      .build();

    const selectType = options?.gameType ?? 'slot';
    const url = {
      slot: 'https://ts.bacctest.com/slotView?club=8',
      fish: 'https://ts.bacctest.com/fishView?club=8',
    };
    try {
      // 前往指定的網頁
      const selectUrl = url[selectType];
      await driver.get(selectUrl);

      // 等待一段時間，確保所有動態生成內容載入完成
      await driver.sleep(5000); // 5000 毫秒為延遲時間（5秒）

      // 取得網頁標題並輸出
      const title = await driver.getTitle();
      console.log('網頁標題:', title);

      // 取得網頁內容並輸出
      const pageSource = await driver.getPageSource();
      console.log('網頁內容:', pageSource);
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
