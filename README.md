# WebPageCompare
網頁比對物件工具

# 初始化
```
npm i
```
## 必要安裝
```
npm install --save @nestjs/axios cheerio iconv-lite

npm install -g ts-node
```
## 修正 eslint 錯誤
```
Delete `␍` eslint(prettier/prettier) [第 1 行,第 36 欄]
```
修正指令為:
```
npm run lint --fix
```
或是在 `.eslintrc.js` 檔案新增參數 `'linebreak-style': 'off'`
與 `.prettierrc` 檔案新增參數 `"endOfLine": "auto"`

# 功能設定
開啟 .env 檔案
GAME_TYPE 可設定為:真人、電子、捕魚機 等等....
CLUB_TYPE 可設定為:RSG、JDB、DS、GEMINI、RG電子 等等....
範例如下:
```
GAME_TYPE='電子'
CLUB_TYPE='RSG'
```

# 使用方法
執行結束會自動關閉程式
檢查一下【終端機】視窗
會印出如下:
```
1 text: 戰神呂布 正確✅
2 text: 聚寶財神 正確✅
3 text: 羅馬競技場 正確✅
4 text: 法老王 正確✅
5 text: 雷神之錘 正確✅
6 text: 麻將發了 正確✅
等等 ....
```
1. 全部✅為執行正確
2. 一執行就 throw 例外，表示原始的 'GameList.xlsx' 有重複資料
3. 順序錯誤也會標示 Excel 的順序與遊戲畫面上的順序
