# 月隱塔羅牌卡資料庫

收錄 78 張牌卡，包括 22 張大阿爾克那與 56 張小阿爾克那。每張包含中英文牌名、符號、繁體中文關鍵詞、正位與逆位解讀。牌義沿用月隱塔羅的網站內容，供娛樂與自我反思。

| 檔案 | 用途 |
| --- | --- |
| `tarot.sqlite3` | 可直接使用的 SQLite 資料庫 |
| `data/cards.json` | 可版本控管的 UTF-8 牌卡資料，也可由前端直接讀取 |
| `schema.sql` | 牌卡資料表、欄位約束與索引 |
| `build_database.py` | 驗證牌卡資料並產生 SQLite 檔 |

## 月隱塔羅網站

網站提供單張指引與三張牌陣，從 `data/cards.json` 讀取牌義。抽牌紀錄保存在使用者的瀏覽器。

首頁的「多點牌陣」可選擇三、五或七個牌位，並查看加權解讀、相鄰牌卡分析與結語。

在儲存庫根目錄啟動本機預覽，再開啟 `http://localhost:8000/`。

```sh
python3 -m http.server 8000
```

## 查詢範例

透過 `sqlite3 tarot.sqlite3` 開啟資料庫，查詢指定牌卡的兩種解讀。

```sql
SELECT name_zh_hant, upright_zh_hant, reversed_zh_hant
FROM cards
WHERE id = 'major-18';
```

從整副牌隨機取三張不同的牌。

```sql
SELECT id, name_zh_hant, symbol, upright_zh_hant, reversed_zh_hant
FROM cards
ORDER BY RANDOM()
LIMIT 3;
```

## 欄位與更新方式

- `id` 是穩定的牌卡識別碼。 `deck_index` 是從 0 到 77 的原始牌組順序。
- `arcana` 為 `major`（大牌）或 `minor`（小牌）。大牌的 `suit` 為空，小牌的花色代碼為 `wands`、`cups`、`swords` 或 `pentacles`。
- 大牌的 `rank` 從 0 到 21。小牌從 1（王牌）到 14（國王），11 到 13 依序為侍者、騎士與皇后。

修改牌義時，先編輯 `data/cards.json`，再用 Python 3.8 以上重建。此步驟會更新上方的資料庫檔案。

```sh
python3 build_database.py --replace
```

若要保留現有資料庫，可指定新檔名。

```sh
python3 build_database.py --output tarot-new.sqlite3
```
