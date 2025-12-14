// src/components/PageHeader/PageHeader.tsx
import styles from "./pageHeader.module.css";

interface Props {
  title: string;
  desc?: string;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<Props> = ({title, desc, extra}) => {
  return (
    <div className={styles.header}>
      <div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      <div>{extra}</div>
    </div>
  );
};

export default PageHeader;