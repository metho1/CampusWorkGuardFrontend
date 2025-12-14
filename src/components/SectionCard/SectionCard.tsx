// src/components/SectionCard/SectionCard.tsx
import {Button, Card, Input, Select, Space, Table, Tabs} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import styles from "./sectionCard.module.css";

export interface SectionTab {
  key: string;
  label: string;
}

interface Props {
  tabs: SectionTab[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
  searchPlaceholder?: string;
  columns: any[];
  dataSource: any[];
}

const SectionCard: React.FC<Props> = ({
                                        tabs, activeKey, onTabChange,
                                        searchPlaceholder, columns, dataSource
                                      }) => {
  return (
    <Card>
      {/* Tabs */}
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        items={tabs}
        className={styles.tabs}
      />

      {/* 搜索 / 筛选区 */}
      <div className={styles.toolbar}>
        <Space>
          <Input.Search
            placeholder={searchPlaceholder}
            allowClear
            style={{width: 220}}
          />
          <Select placeholder="所有状态" style={{width: 120}}/>
          <Select placeholder="所有类型" style={{width: 120}}/>
          <Button icon={<FilterOutlined/>}>筛选</Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{pageSize: 5}}
      />
    </Card>
  );
};

export default SectionCard;