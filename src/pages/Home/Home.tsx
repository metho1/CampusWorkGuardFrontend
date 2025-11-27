// src/pages/Home/Home.tsx
import React, {useState} from "react";
import {Avatar, Button, Dropdown, Layout, Menu} from "antd";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {Outlet, useNavigate} from "react-router-dom";
import styles from "./home.module.css";

const {Header, Sider, Content} = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/home/part-time",
      icon: <TeamOutlined/>,
      label: "兼职信息管理",
    },
    {
      key: "/home/match",
      icon: <DeploymentUnitOutlined/>,
      label: "智能匹配",
    },
    {
      key: "/home/salary",
      icon: <DollarOutlined/>,
      label: "薪资担保",
    },
    {
      key: "/home/attendance",
      icon: <ClockCircleOutlined/>,
      label: "考勤与工作记录",
    },
    {
      key: "/home/complaint",
      icon: <ExclamationCircleOutlined/>,
      label: "投诉维权",
    },
    {
      key: "/home/statistics",
      icon: <BarChartOutlined/>,
      label: "数据统计分析",
    },
  ];

  const userMenu = {
    items: [
      {key: "profile", label: "个人中心"},
      {key: "logout", label: "退出登录"},
    ],
  };

  return (
    <Layout className={styles.layout}>
      {/* 左侧菜单 */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        className={styles.sider}
      >
        <div className={styles.logo}>
          {!collapsed ? "大学生兼职保障系统" : "兼职"}
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["/home/part-time"]}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>

      <Layout>
        {/* 顶部栏 */}
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              width: 64,
              height: 64,
            }}
          />

          <div className={styles.headerRight}>
            <Dropdown menu={userMenu}>
              <Avatar
                size="small"
                src="https://i.pravatar.cc/150?img=3"
                style={{cursor: "pointer"}}
              />
            </Dropdown>

            <span className={styles.username}>小米科技有限公司</span>
          </div>
        </Header>

        {/* 页面内容 */}
        <Content className={styles.content}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
