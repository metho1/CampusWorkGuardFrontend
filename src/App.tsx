// 根组件，组织页面内容与路由等
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {useRoutes} from "react-router-dom";
import {routes} from "@/router/index.tsx";

function App() {
  return useRoutes(routes);
}

export default App
