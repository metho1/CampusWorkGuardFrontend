// src/router/index.tsx
import type {RouteObject} from "react-router-dom";
import {Navigate} from "react-router-dom";
import Login from "@/pages/Login/Login";
import MainLayout from "@/pages/Home/Home.tsx";
import PartTime from "@/pages/PartTime/PartTime.tsx";
import Match from "@/pages/Match/Match.tsx";
import Salary from "@/pages/Salary/Salary.tsx";
import Attendance from "@/pages/Attendance/Attendance.tsx";
import Complaint from "@/pages/Complaint/Complaint.tsx";
import Statistics from "@/pages/Statistics/Statistics.tsx";
import Profile from "@/pages/Profile/Profile.tsx";
import Verify from "@/pages/Verify/Verify.tsx";
import HomeRedirect from "@/router/HomeRedirect.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login"/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <MainLayout/>,
    children: [
      {index: true, element: <HomeRedirect/>}, // 根据用户角色跳转到默认首页
      {path: "verify", element: <Verify/>}, //企业认证审核
      {path: "part-time", element: <PartTime/>}, //兼职信息管理
      {path: "match", element: <Match/>}, //智能匹配
      {path: "salary", element: <Salary/>}, //薪资担保
      {path: "attendance", element: <Attendance/>}, //考勤与工作记录
      {path: "complaint", element: <Complaint/>}, //投诉维权
      {path: "statistics", element: <Statistics/>}, //数据统计分析
      {path: "profile", element: <Profile/>}, //个人中心
    ],
  },
];
