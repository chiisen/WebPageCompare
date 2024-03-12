import { WebDriver, WebElement, By } from 'selenium-webdriver';

/**
 * 輔助方法
 */
export class Utils {
  /**
   * 找到瀏覽器下指定 class 名稱的元素
   * @param webDriver
   * @param className
   * @param ms
   * @param action
   * @returns
   */
  static async findAllClassName(
    webDriver: WebDriver,
    className: string,
    ms: number,
    action: string,
  ): Promise<WebElement> {
    try {
      const element = await webDriver.findElement(By.className(className));

      switch (action) {
        case 'click':
          await element.click();
          break;
      }
      // 等待一段時間，確保所有動態生成內容載入完成
      await webDriver.sleep(ms); // ms 毫秒為延遲時間（ms/1000 秒）
      return element;
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 找到指定 text 內容的元素
   * @param driver
   * @param webElement
   * @param text
   * @param ms
   * @param action
   * @returns
   */
  static async findElementText(
    driver: WebDriver,
    webElement: WebElement,
    text: string,
    ms: number,
    action: string,
  ): Promise<WebElement> {
    const element = await webElement.findElement(
      By.xpath(`//*[contains(text(), '${text}')]`),
    );

    switch (action) {
      case 'click':
        await element.click();
        break;
    }
    // 等待一段時間，確保所有動態生成內容載入完成
    await driver.sleep(ms); // ms 毫秒為延遲時間（ms/1000 秒）
    return element;
  }
  /**
   * 找到瀏覽器下指定 text 內容的元素
   * @param driver
   * @param text
   * @param ms
   * @param action
   * @returns
   */
  static async findAllText(
    driver: WebDriver,
    text: string,
    ms: number,
    action: string,
  ): Promise<WebElement> {
    const element = await driver.findElement(
      By.xpath(`//*[contains(text(), '${text}')]`),
    );

    switch (action) {
      case 'click':
        await element.click();
        break;
    }
    // 等待一段時間，確保所有動態生成內容載入完成
    await driver.sleep(ms); // ms 毫秒為延遲時間（ms/1000 秒）
    return element;
  }
}
