// src/components/PageTable/PageTable.tsx
import {Button, Input, Select, Space, Table} from "antd";
import {FilterOutlined} from "@ant-design/icons";

const PageTable: React.FC<{
  columns: any[];
  dataSource: any[];
  placeholder?: string;
}> = ({columns, dataSource, placeholder}) => (
  <>
    <Space style={{marginBottom: 16}}>
      <Input.Search placeholder={placeholder} allowClear/>
      <Select placeholder="所有状态" style={{width: 120}}/>
      <Select placeholder="所有类型" style={{width: 120}}/>
      <Button icon={<FilterOutlined/>}>筛选</Button>
    </Space>

    <Table
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      pagination={{pageSize: 5}}
    />
  </>
);

export default PageTable;