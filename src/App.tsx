// 根组件，组织页面内容与路由等
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "@/pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  )
}

export default App
