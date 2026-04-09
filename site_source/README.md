# Olivia Wu Personal Homepage

## 预览

直接打开 `index.html` 即可预览。也可以在 `平面设计` 目录运行：

```powershell
python -m http.server 8000
```

然后访问：

`http://localhost:8000/site_source/`

## 文案更新

所有页面文案集中在：

`data/content.xlsx`

表格列：

- `key`：页面里的文案编号，不建议修改
- `zh`：中文版本
- `en`：英文版本
- `de`：德文版本

修改 Excel 后，在 `site_source` 目录运行：

```powershell
python tools/sync_content.py
```

脚本会从 `data/content.xlsx` 重新生成 `data/content.js`，网页会自动读取新的三语文案。
