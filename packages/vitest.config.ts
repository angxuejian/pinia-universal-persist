import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // 允许使用 describe/it/expect 等全局变量
    environment: 'happy-dom', // 模拟浏览器环境
    include: ['tests/**/*.spec.ts'], // 测试文件匹配规则
    includeSource: ['packages/**/*.{js,ts,vue}'],
  },
});
