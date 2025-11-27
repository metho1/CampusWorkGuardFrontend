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
// import NotFound from "@/pages/NotFound";

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
      {index: true, element: <Navigate to="/home/part-time"/>},
      {path: "part-time", element: <PartTime/>},
      {path: "match", element: <Match/>},
      {path: "salary", element: <Salary/>},
      {path: "attendance", element: <Attendance/>},
      {path: "complaint", element: <Complaint/>},
      {path: "statistics", element: <Statistics/>},
    ],
  },
  // {path: "*", element: <NotFound/>},
];
