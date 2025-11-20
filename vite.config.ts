// Vite配置文件
// 注册React插件 以支持React项目的构建和开发
// 设置别名、端口、代理等 选项可以根据需要进行扩展

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 允许局域网访问
    port: 5173,
    open: true
  },
  // 路径别名
  resolve: {
    alias: {
      // "@": "/src"
      "@": path.resolve(__dirname, "src"),
    }
  }
})
