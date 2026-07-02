---
name: cooklikehoc-recipe-search
description: Search recipes by name on the CookLikeHOC website (https://cooklikehoc.soilzhu.su), a collection of 老乡鸡 (Lao Xiang Ji) recipe books. Use when the user wants to find a recipe by name, search for dishes, look up cooking instructions, ingredients, or step-by-step guides from the CookLikeHOC recipe collection.
---

# CookLikeHOC Recipe Search

Search recipes by name on the CookLikeHOC website (https://cooklikehoc.soilzhu.su), which catalogs recipes from 老乡鸡 (Lao Xiang Ji) published in their recipe traceability reports.

## How Search Works

The site uses VitePress's built-in local search (DocSearch-like). When you open the search modal and type a query, it searches page titles and content in real-time. Results display:

- **Recipe name** with highlighted matches
- **Section** (配料 / 步骤 / 鸡块制作, etc.)
- **Category** (e.g., 蒸菜, 炖菜)
- **Link** to the specific recipe section

Recipe URLs follow the pattern: `/{category}/{recipe-name}#{section}`

## Prerequisites

This skill requires the **Browser** (`control-in-app-browser`) skill to interact with the website. Set up the browser runtime before searching:

```js
const { setupBrowserRuntime } = await import("<plugin root>/scripts/browser-client.mjs");
await setupBrowserRuntime({ globals: globalThis });
const browser = await agent.browsers.getForUrl("https://cooklikehoc.soilzhu.su");
```

## Search Steps

1. **Open a tab and navigate to the site**
   ```js
   const tab = await browser.tabs.new();
   await tab.goto("https://cooklikehoc.soilzhu.su");
   await tab.playwright.waitForLoadState({ state: "load" });
   ```

2. **Open the search modal** by clicking the Search button
   ```js
   const searchBtn = tab.playwright.getByRole("button", { name: "Search" });
   await searchBtn.click();
   await tab.playwright.waitForTimeout(500);
   ```

3. **Type the search query** into the search box
   ```js
   const searchbox = tab.playwright.getByRole("searchbox");
   await searchbox.fill("<recipe name>");
   await tab.playwright.waitForTimeout(1500);
   ```

4. **Read the search results** from the DOM snapshot
   ```js
   const snapshot = await tab.playwright.domSnapshot();
   ```
   Parse the snapshot for `option` elements inside `listbox`, each containing recipe links with URLs like `/{category}/{recipe-name}#{section}`.

5. **Present results** to the user with recipe names, categories, and links. Each result option contains:
   - A `link` element with the recipe URL
   - The recipe title (may have highlighted `<mark>` elements for matches)
   - The section name (配料 / 步骤 / etc.)

6. **Navigate to a result** by clicking the link or using `tab.goto(url)`:
   ```js
   const resultLink = tab.playwright.getByRole("link", { name: /...recipe name.../ });
   await resultLink.click();
   ```
   Or use `tab.goto()` with the full URL:
   ```js
   await tab.goto("https://cooklikehoc.soilzhu.su/<category>/<recipe-name>");
   ```

## Recipe Page Structure

Recipe pages have sections:
- **配料** (Ingredients)
- **步骤** (Steps) - sometimes with subsections like 鸡块制作 (chicken prep), 炒制 (stir-frying), 炖煮 (braising)
- **Tips** (if available)

## Categories

| Chinese | Pinyin | English |
|---------|--------|---------|
| 炒菜 | chǎo cài | Stir-fry |
| 炖菜 | dùn cài | Braised |
| 烤类 | kǎo lèi | Roasted |
| 凉拌 | liáng bàn | Cold dishes |
| 卤菜 | lǔ cài | Braised in soy sauce |
| 配料 | pèi liào | Ingredients/Seasonings |
| 砂锅菜 | shā guō cài | Clay pot dishes |
| 汤 | tāng | Soup |
| 烫菜 | tàng cài | Blanched |
| 饮品 | yǐn pǐn | Beverages |
| 早餐 | zǎo cān | Breakfast |
| 炸品 | zhà pǐn | Fried |
| 蒸菜 | zhēng cài | Steamed |
| 主食 | zhǔ shí | Staples |
| 煮锅 | zhǔ guō | Boiled pot |
