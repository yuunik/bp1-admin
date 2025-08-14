# PD1 Web Admin

一个基于 Vue 3 + Vite 构建的现代化管理后台系统，提供用户管理、OBD设备管理、订单管理等功能。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7.0
- **UI 组件库**: Element Plus 2.10
- **CSS 框架**: UnoCSS
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP 客户端**: Axios
- **样式预处理**: Sass/SCSS
- **代码规范**: ESLint + Prettier + Stylelint
- **Git 钩子**: Husky

## 项目特性

- 🚀 基于 Vue 3 Composition API 开发
- 📦 使用 Vite 构建，开发体验极佳
- 🎨 集成 Element Plus 组件库
- 🎯 UnoCSS 原子化 CSS 框架
- 📱 响应式设计，支持多端适配
- 🔐 完整的权限管理系统
- 📊 数据可视化图表
- 🛠 丰富的工具函数和组件
- 📄 支持 PDF 导出和报告生成
- 🎭 SVG 图标系统

## 功能模块

- **用户管理**: 用户信息管理、权限控制
- **OBD管理**: OBD设备管理和数据监控
- **订单管理**: 订单处理和状态跟踪
- **数据库管理**: 数据库操作和维护
- **应用配置**: 系统配置和参数设置
- **仪表盘**: 数据统计和可视化展示
- **分享功能**: 支持AI聊天、论坛、报告分享

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境

```bash
# 本地开发环境
npm run local

# 开发环境
npm run dev

# 生产环境
npm run pro
```

### 构建部署

```bash
# 构建开发环境
npm run build:dev

# 构建生产环境
npm run build:pro

# 构建本地环境
npm run build:local
```

### 代码规范

```bash
# ESLint 检查
npm run lint

# ESLint 修复
npm run fix

# 代码格式化
npm run format

# 样式检查和修复
npm run lint:style
```

## 项目结构

```
src/
├── apis/              # API 接口
├── assets/            # 静态资源
├── components/        # 公共组件
├── composables/       # 组合式函数
├── directives/        # 自定义指令
├── layout/            # 布局组件
├── plugins/           # 插件
├── router/            # 路由配置
├── share/             # 分享页面
├── store/             # 状态管理
├── styles/            # 样式文件
├── types/             # 类型定义
├── utils/             # 工具函数
├── views/             # 页面组件
├── App.vue            # 根组件
├── main.js            # 入口文件
└── permission.js      # 权限控制
```

## 开发规范

### 组件命名

- 组件文件使用 PascalCase 命名
- 组件名称使用 PascalCase
- 页面组件放在 `views` 目录下
- 公共组件放在 `components` 目录下

### 样式规范

- 使用 UnoCSS 原子化 CSS
- SCSS 变量统一在 `styles/variable.scss` 中定义
- 组件样式使用 scoped

### API 规范

- API 接口统一在 `apis` 目录下管理
- 使用 axios 进行 HTTP 请求
- 统一的错误处理和响应拦截

## 环境配置

项目支持多环境配置：

- **local**: 本地开发环境
- **dev**: 开发环境
- **pro**: 生产环境

在项目根目录创建对应的环境文件：

- `.env.local`
- `.env.dev`
- `.env.pro`

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目地址: https://gittmp.proteus-dt.com/xiamen-dev/pd1-web-admin
- 问题反馈: 请在 GitLab Issues 中提交

---

**注意**: 本项目仅供内部使用，请勿外传。
