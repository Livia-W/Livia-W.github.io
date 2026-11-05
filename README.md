# Olivia Wu Personal Homepage

线上主页：https://livia-w.github.io/

GitHub 仓库：https://github.com/Livia-W/Livia-W.github.io

## 预览

直接打开 `index.html` 即可预览。也可以在 `site_source` 目录运行：

```powershell
python -m http.server 8000
```

然后访问：

`http://localhost:8000/`

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

## 图片资源

- `assets/images/logo.png`：个人 logo，供五个页面的导航栏和装饰水印共用。
- `assets/images/favicon.png`：由同一 logo 生成的透明背景网站图标。
- `assets/images/portrait.jpg`：首页个人照片，已压缩为网页尺寸；页面通过 CSS 调整显示裁切，保留照片原貌。

替换图片时使用以上路径即可沿用现有页面结构。照片替换后请同时检查桌面和手机上的显示效果。

## 简历

首页和关于页提供原版 PDF 下载，文件位于 `assets/documents/Olivia-Wu-Resume.pdf`。

当前履历根据提供的 `A4 - 6 (1).pdf` 更新。更新简历时，同时替换该 PDF、修改 `data/content.xlsx` 中的三语文案，再运行同步脚本。

## GitHub Pages

网站是纯静态页面，发布源为仓库的 `main` 分支根目录，提交后由 GitHub Pages 自动发布。保留 `.nojekyll`，无需安装前端依赖或执行构建。
