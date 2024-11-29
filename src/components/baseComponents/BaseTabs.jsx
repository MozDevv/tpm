import React, { useState } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const BaseTabs = ({ tabPanes }) => {
  const [activeKey, setActiveKey] = useState('1');

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleTabChange}
      className="!bg-transparent z-50 ml-3"
      style={{ zIndex: 999999999 }}
      tabBarExtraContent={<div className="bg-primary h-1" />} // Custom ink bar style
    >
      {tabPanes.map((pane) => (
        <TabPane
          tab={
            <span className="text-primary font-montserrat">{pane.title}</span>
          }
          key={pane.key}
        >
          <div className="font-montserrat">{pane.content}</div>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default BaseTabs;
