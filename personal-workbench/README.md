# 个人成长工作台 🌱

一个轻量级的个人成长管理Web应用，纯前端实现，数据本地存储，打开浏览器就能用。

## ✨ 功能特性

### 📱 五大核心模块

| 模块 | 功能 |
|------|------|
| **首页** | 时段问候 + 今日计划预览 + 每日热点 + 艺术灵感 + 个性化穿搭推荐 |
| **计划** | 今日计划管理 + 本周进度统计 + 身体数据档案 + 智能健康食谱 + 运动视频推荐 |
| **记账** | 快捷记账浮层 + 收支分类 + 账单明细 + 月度预算管理 + 超支提醒 |
| **知识** | 每日雅思15词 + 核心词汇 + 口语场景对话 + 阅读打卡 + 灵感素材库 |
| **我的** | 个人信息 + 身形档案 + 穿搭偏好 + 数据统计 + 数据导出/清空 |

### 🎨 设计亮点
- 苹果绿清新治愈风格
- 大圆角卡片 + 柔和投影
- 竖纹肌理背景
- 圆形勾选交互，完成打勾带弹跳动效
- 移动端优先，响应式设计

### 💾 数据持久化
- 所有数据存储在浏览器 localStorage
- 刷新页面不丢失
- 支持导出JSON备份
- 分类存储：计划、账单、阅读、身体数据、英语学习、设置

## 🚀 快速开始

### 方式一：直接打开
双击 `index.html` 即可在浏览器中使用。

### 方式二：本地服务器
```bash
# 进入项目目录
cd personal-workbench

# 启动本地服务器（任选其一）
python -m http.server 8080
# 或
npx serve .
```

然后访问 `http://localhost:8080`

## 📦 部署到 GitHub Pages

### 1. 创建 GitHub 仓库
1. 登录你的 GitHub 账号
2. 新建仓库，命名为 `personal-workbench`
3. 选择 Public（公开仓库才能用 GitHub Pages）

### 2. 上传代码
```bash
# 进入项目目录
cd personal-workbench

# 初始化 git
git init
git add .
git commit -m "init: 个人成长工作台 v1.0"

# 关联远程仓库
git remote add origin https://github.com/guhijames3781-art/personal-workbench.git
git branch -M main
git push -u origin main
```

### 3. 开启 GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 `main` 分支，根目录 `/`
3. 点击 Save，等待几分钟
4. 访问 `https://guhijames3781-art.github.io/personal-workbench/`

## 📁 项目结构

```
personal-workbench/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── storage.js      # 数据存储模块
│   ├── data.js         # 模拟数据模块
│   └── app.js          # 主应用逻辑
└── README.md           # 说明文档
```

## 🔧 自定义配置

### 修改主题色
编辑 `css/style.css` 中的 CSS 变量：
```css
:root {
    --primary: #4CAF50;    /* 主色调 */
    --primary-light: #66BB6A;
    --primary-bg: #E8F5E9; /* 背景色 */
}
```

### 添加/修改分类
编辑 `js/data.js` 中的分类数组：
- `expenseCategories` - 支出分类
- `incomeCategories` - 收入分类

### 调整内容数据
所有模拟数据都在 `js/data.js` 中：
- 新闻、穿搭、食谱、运动视频
- 英语单词、对话
- 灵感素材

## 🔗 外部平台跳转

应用内置以下平台的跳转支持：
- 小红书 - 穿搭、灵感素材
- 抖音 - 食谱做法、运动跟练
- Pinterest - 设计灵感
- Behance - 设计作品
- 古村田路9号 - 文创灵感

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 五大核心功能模块
- 数据本地持久化
- 苹果绿清新风格UI

## 📄 License

MIT License - 自由使用和修改
