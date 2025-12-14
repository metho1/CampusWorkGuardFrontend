// src/components/StatCards/StatCards.tsx
import {Card} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from "@ant-design/icons";
import styles from "./statCards.module.css";

// 文字颜色： success: 绿色，warning: 橙色，info: 灰色，danger: 红色
export type ExtraType = "success" | "warning" | "info" | "danger";

// 图标： check: 对号，loading: 处理中，warning: 警告，up: 上升，down: 下降
export interface StatExtra {
  text: string;
  type?: ExtraType;
  icon?: "check" | "loading" | "warning" | "up" | "down";
}

export interface StatItem {
  title: string;
  value: string | number;
  extra?: StatExtra;
}

const iconMap = {
  check: <CheckCircleOutlined/>,
  loading: <ClockCircleOutlined/>,
  warning: <WarningOutlined/>,
  up: <ArrowUpOutlined/>,
  down: <ArrowDownOutlined/>
};

const StatCards: React.FC<{ list: StatItem[] }> = ({list}) => {
  return (
    <div className={styles.grid}>
      {list.map((item, i) => (
        <Card key={i}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.value}>{item.value}</div>
          {item.extra && (
            <div className={`${styles.extra} ${styles[item.extra.type || "info"]}`}>
              {item.extra.icon && (<span className={styles.icon}>{iconMap[item.extra.icon]}</span>)}
              <span>{item.extra.text}</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
