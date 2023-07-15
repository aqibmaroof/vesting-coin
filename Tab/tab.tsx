import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import "./tab.module.scss";

interface ITabOptions {
  key: string;
  title: string;
}
interface IProps {
  activeKey: string;
  tabOptions: ITabOptions[];
  onChangeTab: (selectedTab: string) => void;
}

function TabComponent(props: IProps) {
  const onTabSelect = (k: string | null) => {
    if (k) props.onChangeTab(k);
  };

  return (
    <Tabs
      defaultActiveKey={props.activeKey}
      id="uncontrolled-tab-example"
      onSelect={(k) => onTabSelect(k)}
      className="custom-tab-width"
    >
      {props.tabOptions.map((option: ITabOptions) => {
        return (
          <Tab            
            key={option.key}
            eventKey={option.key}
            title={option.title}
            tabClassName="heading-4"
          ></Tab>
        );
      })}
    </Tabs>
  );
}

export default TabComponent;
