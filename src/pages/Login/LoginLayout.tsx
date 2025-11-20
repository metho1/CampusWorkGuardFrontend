// src/pages/Login/LoginLayout.tsx
import React from "react";
import styles from "./loginLayout.module.css";
import {Layout} from 'antd';

const {Header, Content, Footer} = Layout;

interface Props {
  children: React.ReactNode;
}

const LoginLayout: React.FC<Props> = ({children}) => {
  return (
    <Layout>
      <Header className={styles.header}>
        大学生兼职保障系统
      </Header>
      <Content className={styles.container}>
        {/* 蒙层 */}
        {/*<div className={styles.overlay}></div>*/}

        {/* 登录框 */}
        <div className={styles.formWrapper}>
          {children}
        </div>

        {/* 文案位置 */}
        <div className={styles.textArea}>
          <div className={styles.title}>海量优质人才，在线约面</div>
          <div className={styles.subTitle}>找工作，上BOSS直聘直接谈</div>
        </div>
      </Content>
      <Footer className={styles.footer}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>

  );
};

export default LoginLayout;
