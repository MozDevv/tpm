import { Select } from "antd";

export const renderCustomEditor = (field, params) => {
  const { value, node } = params;
  const handleInputChange = (event) => {
    node.setDataValue(field.name, event.target.value);
  };

  switch (field.type) {
    case "select":
      return field.multiple ? (
        <Select
          multiple
          size="small"
          value={value || []}
          onChange={(event) =>
            handleInputChange({ target: { value: event.target.value } })
          }
        >
          {field.options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={(value || []).indexOf(option.id) > -1} />
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          select
          variant="outlined"
          size="small"
          fullWidth
          value={value || field.default}
          onChange={handleInputChange}
        >
          <MenuItem value="">Select {field.label}</MenuItem>
          {field.options.map((option) => (
            <MenuItem key={option.name} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      );
    case "switch":
      return (
        <FormControlLabel
          control={
            <Switch
              checked={value === true}
              onChange={(event) =>
                handleInputChange({ target: { value: event.target.checked } })
              }
            />
          }
          label={value ? "Yes" : "No"}
        />
      );
    case "date":
      return (
        <TextField
          type="date"
          variant="outlined"
          size="small"
          value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
          onChange={handleInputChange}
          fullWidth
        />
      );
    case "autocomplete":
      return (
        <Autocomplete
          options={field.options}
          getOptionLabel={(option) => option.name}
          value={field.options.find((option) => option.id === value) || null}
          onChange={(event, newValue) =>
            handleInputChange({
              target: { value: newValue ? newValue.id : "" },
            })
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" fullWidth />
          )}
        />
      );
    default:
      return (
        <TextField
          type={field.type}
          variant="outlined"
          size="small"
          fullWidth
          value={value || ""}
          onChange={handleInputChange}
        />
      );
  }
};
