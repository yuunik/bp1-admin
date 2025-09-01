# PD1 Web Admin

A modern management backend system built on Vue 3 and Vite, providing user management, OBD device management, order management, and other functions.

## Technology Stack

- **Front-end Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 7.0
- **UI Component Library**: Element Plus 2.10
- **CSS Framework**: UnoCSS
- **State Management**: Pinia
- **Routing Manager**: Vue Router 4
- **HTTP Client**: Axios
- **Style Preprocessor**: Sass/SCSS
- **Coding Standards**: ESLint + Prettier + Stylelint
- **Git Hooks**: Husky

## Project Features

- 🚀 Developed with the Vue 3 Composition API
- 📦 Built with Vite for an excellent development experience
- 🎨 Integrated with the Element Plus component library
- 🎯 UnoCSS, an atomic CSS framework
- 📱 Responsive design, supporting multi-device adaptation
- 🔐 Complete permission management system
- 📊 Data visualization charts
- 🛠 Rich tool functions and components
- 📄 Supports PDF export and report generation
- 🎭 SVG icon system

## Functional Modules

- **User Management**: User information management and permission control
- **OBD Management**: OBD device management and data monitoring
- **Order Management**: Order processing and status tracking
- **Database Management**: Database operations and maintenance
- **Application Configuration**: System configuration and parameter settings
- **Dashboard**: Data statistics and visualization
- **Sharing**: Supports AI chat, forums, and report sharing

## Environment Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0

## Quick Start

### Installation Dependencies

```bash
npm install
# or
yarn install
```

### Development Environment

```bash
# Local Development Environment
npm run local

# Development Environment
npm run dev

# Production Environment
npm run pro
```

### Build and Deploy

```bash
# Build Development Environment
npm run build:dev

# Build Production Environment
npm run build:pro

# Build Local Environment
npm run build:local
```

### Coding Standards

```bash
# ESLint Checks
npm run lint

# ESLint Fixes
npm run fix

# Code Formatting
npm run format

# Style Checks and Fixes
npm run lint:style
```

## Project Structure

```
src/
├── apis/ # API endpoints
├── assets/ # Static assets
├── components/ # Public components
├── composables/ # Combination Functions
├── directives/ # Custom Directives
├── layout/ # Layout Components
├── plugins/ # Plugins
├── router/ # Routing Configuration
├── share/ # Share Pages
├── store/ # State Management
├── styles/ # Style Files
├── types/ # Type Definitions
├── utils/ # Utility Functions
├── views/ # Page Components
├── App.vue # Root Component
├── main.js # Entry File
└── permission.js # Permission Control

## Development Guidelines

### Component Naming

- Use PascalCase for component file names
- Use PascalCase for component names
- Place page components in the `views` directory
- Place public components in the `components` directory

### Style Guidelines

- Use UnoCSS for Atomization CSS
- SCSS variables are defined in `styles/variable.scss`
- Component styles are scoped

### API Specification

- API endpoints are managed in the `apis` directory
- HTTP requests are made using axios
- Unified error handling and response interception

## Environment Configuration

The project supports multiple environments:

- **local**: Local development environment
- **dev**: Development environment
- **pro**: Production environment

Create corresponding environment files in the project root directory:

- `.env.local`
- `.env.dev`
- `.env.pro`

## Browser Support

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## Contribution Guidelines

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit`) -m 'Add some AmazingFeature')
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 本周更新

### Inventory 模块

- 完成 Inventory 页面的ui, 未找到数据接口, 等待后续确认
- 完成 Create Inbound Order 和 Create Outbound Order 页面的ui, 未找到数据接口, 等待后续确认
- 完成 Inbound Details 和 Outbound Details 页面的ui, 未找到数据接口, 等待后续确认

### Internal 模块

- 完成 Internal 页面的ui, 未找到数据接口, 等待后续确认
- 完成 Internal Details 页面的ui, 未找到数据接口, 等待后续确认
- 完成 Internal Details 编辑页面的ui, 未找到数据接口, 等待后续确认
- 完成 Create Internal User 页面的ui, 未找到数据接口, 等待后续确认

### External 模块

- 完成 External 页面的ui, 及接口接入工作
- 完成 Create Workshp 页面所有功能
- External Details 页面的ui待做

### Forum Management 模块

- 完成 Forum Management 页面的ui, 未找到数据接口, 等待后续确认
- 完成 Post Details 页面的ui, 未找到数据接口, 等待后续确认

### Settings 模块

- 完成 Settings 页面的ui, 未找到数据接口, 等待后续确认

### Notification 模块

- 完成 Notification 页面的ui, 未找到数据接口, 等待后续确认
```
