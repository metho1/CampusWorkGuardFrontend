// src/components/PageTabs/PageTabs.tsx
import {Tabs} from "antd";

const PageTabs: React.FC<{ tabs: string[] }> = ({tabs}) => {
  return (
    <Tabs
      items={tabs.map((key) => ({key, label: key}))}
      style={{marginBottom: 16}}
    />
  );
};

export default PageTabs;