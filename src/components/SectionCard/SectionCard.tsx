// src/components/SectionCard/SectionCard.tsx
import {Button, Card, Input, Select, Space, Table} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import styles from "./sectionCard.module.css";

interface Props {
  searchPlaceholder?: string;
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  pagination?: any;

  searchValue?: string;
  statusValue?: string;
  typeValue?: string;

  onSearchChange?: (v: string) => void;
  onStatusChange?: (v: string) => void;
  onTypeChange?: (v: string) => void;
  onFilter?: () => void;
}

const SectionCard: React.FC<Props> = ({
                                        searchPlaceholder, columns, dataSource,
                                        loading,
                                        pagination,
                                        searchValue,
                                        statusValue,
                                        typeValue,
                                        onSearchChange,
                                        onStatusChange,
                                        onTypeChange,
                                        onFilter,
                                      }) => {
  return (
    <Card>
      {/* 搜索 / 筛选区 */}
      <div className={styles.toolbar}>
        <Input.Search
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          style={{width: 220}}
          onSearch={onFilter}
        />
        <Space>
          <Select style={{width: 120}} value={statusValue} onChange={onStatusChange}
                  options={[
                    {label: "所有状态", value: ""},
                    {label: "审核中", value: "pending"},
                    {label: "已通过", value: "approved"},
                    {label: "已驳回", value: "rejected"},
                  ]}/>
          <Select style={{width: 120}} value={typeValue} onChange={onTypeChange}
                  options={[
                    {label: "所有类型", value: ""},
                    {label: "兼职", value: "part-time"},
                    {label: "实习", value: "intern"},
                    {label: "全职", value: "full-time"},
                  ]}/>
          <Button icon={<FilterOutlined/>} onClick={onFilter}>筛选</Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
      />
    </Card>
  );
};

export default SectionCard;