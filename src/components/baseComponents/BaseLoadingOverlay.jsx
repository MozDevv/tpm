import React from "react";
import { Spin } from "antd";

const BaseLoadingOverlay = () => {
  return (
    <div style={{}}>
      <Spin size="default" className="ant-spin-dot-item" />
    </div>
  );
};

export default BaseLoadingOverlay;
