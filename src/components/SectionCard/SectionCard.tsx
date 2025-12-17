// src/components/SectionCard/SectionCard.tsx
import {Card, Input, Space, Table} from "antd";
import styles from "./sectionCard.module.css";

interface Props {
  searchPlaceholder?: string;
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  pagination?: any;

  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onFilter?: () => void;

  filters?:React.ReactNode; //自定义筛选组件
}

const SectionCard: React.FC<Props> = ({
                                        searchPlaceholder, columns, dataSource,
                                        loading, pagination, searchValue,
                                        onSearchChange, onFilter, filters,
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
        {filters && <Space>{filters}</Space>}
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