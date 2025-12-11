// Vite配置文件
// 注册React插件 以支持React项目的构建和开发
// 设置别名、端口、代理等 选项可以根据需要进行扩展

import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  // 读取当前环境下的 .env 文件
  const env = loadEnv(mode, process.cwd());
  // 注意：Vite 环境变量都会以 VITE_ 开头
  const baseUrl = env.VITE_BASE_URL;
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0", // 允许局域网访问
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: baseUrl, // 后端服务器地址
          changeOrigin: true, // 是否修改请求头中的host字段
        },
      }
    },
    // 路径别名
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      }
    }
  }
})
