// src/pages/Home/Home.tsx
import React, {useEffect, useState} from "react";
import {Avatar, Button, Dropdown, Layout, Menu, message} from "antd";
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
import {getUserStaticInfoApi, type StaticInfoResponse} from "@/api/user";
import {resolveUrl} from "@/config.ts";
import {deleteEmployerRegisterInfoApi} from "@/api/user.ts";

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
    onClick: ({key}: { key: string }) => {
      if (key === "logout") {
        logout();
      }
      if (key === "profile") {
        navigate("/home/profile");
      }
    },
    items: [
      {key: "profile", label: "个人中心"},
      {key: "logout", label: "退出登录"},
    ],
  };
  // 退出登录
  const logout = () => {
    message.success("退出登录成功");
    localStorage.removeItem("token");
    navigate("/login");
  };
  // 获取用户信息：姓名 + 头像
  const [user, setUser] = useState<StaticInfoResponse["data"] | null>(null);
  useEffect(() => {
    getUserStaticInfoApi().then(res => {
      if (res.code === 200) {
        setUser(res.data);
      } else {
        message.error("身份过期，请重新登录");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }).catch(() => {
      message.error("请先登录");
      navigate("/login");
    });
  }, []);

  return (
    <Layout className={styles.layout}>
      {/* 左侧菜单 */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        width={220}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {collapsed ? "兼职" : "大学生兼职保障系统"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
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
            {/* ====== 新增：企业认证状态提示 ====== */}
            {user?.role === "company" && (
              <div className={styles.verifyStatus}>
                {user.verify_status === "pending" && (
                  <span style={{color: "#faad14"}}>系统将在24h内核实您的身份信息</span>)}

                {user.verify_status === "unverified" && (
                  <span style={{color: "red", cursor: "pointer"}} title={user.fail_info || "点击重新提交认证"}
                        onClick={async () => {
                          try {
                            const res = await deleteEmployerRegisterInfoApi();
                            if (res.code === 200) {
                              message.success("请重新提交认证信息");
                              navigate("/login");
                            } else {
                              message.error(res.message || "删除注册信息失败");
                            }
                          } catch {
                            message.error("请求失败，请稍后重试");
                          }
                        }}>认证失败（点击重新认证）</span>)}

                {user.verify_status === "verified" && (
                  <span style={{color: "#52c41a"}}>认证通过</span>)}
              </div>
            )}

            {/* 用户头像与名称 */}
            <Dropdown menu={userMenu}>
              <Avatar
                src={user?.avatar_url
                  ? resolveUrl(user.avatar_url)
                  : "https://i.pravatar.cc/150?img=3"}
                className={styles.avatar}
              />
            </Dropdown>

            <span className={styles.username}>{user?.name || "xxx"}</span>
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
