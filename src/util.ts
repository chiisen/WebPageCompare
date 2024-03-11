import { WebDriver, WebElement, By } from "selenium-webdriver";

export class Utils {
    static async findElementClassName(webDriver: WebDriver, className: string, ms: number, action: string): Promise<WebElement> {
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
        }
        catch (error) {
            console.log(error);
        }
    }
    static async findElementText(webDriver: WebDriver, webElement: WebElement, text: string, ms: number, action: string): Promise<WebElement> {
        const element = await webElement.findElement(By.xpath(`//*[contains(text(), '${text}')]`));

        switch (action) {
            case 'click':
                await element.click();
                break;
        }
        // 等待一段時間，確保所有動態生成內容載入完成
        await webDriver.sleep(ms); // ms 毫秒為延遲時間（ms/1000 秒）
        return element;
    }
}