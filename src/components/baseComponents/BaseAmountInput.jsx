import React from "react";

import { TextField } from "@mui/material";
import { NumberFormatBase, NumericFormat } from "react-number-format";

const BaseAmountInput = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={true}
      decimalScale={2}
      fixedDecimalScale={true}
    />
  );
};

export default BaseAmountInput;
