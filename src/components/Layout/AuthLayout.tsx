// src/components/Layout/AuthLayout.tsx
import React from "react";
import styles from "./authLayout.module.css";

interface Props {
    children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.title}>海量优质人才，在线约面</div>
                <div className={styles.subTitle}>找工作，上BOSS直聘直接谈</div>
            </div>

            <div className={styles.rightPanel}>{children}</div>
        </div>
    );
};

export default AuthLayout;
