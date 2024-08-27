import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const ContactDetailsForm = ({
  formData,
  handleInputChange,
  errors,
  canEdit,
}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  useEffect(() => {
    // Fetch country data from the API
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : ""),
          }))
          .filter((country) => country.code); // Filter countries with valid codes
        setCountries(countryData);
      })
      .catch((error) => console.error("Error fetching country codes:", error));
  }, []);

  const handleCountryChange = (event) => {
    setSelectedCountryCode(event.target.value);
  };

  return (
    <div className="p-2 mt-[-15px] ">
      <div>
        <FormControl fullWidth variant="outlined" size="small" margin="normal">
          <InputLabel>Country Code</InputLabel>
          <Select
            value={selectedCountryCode}
            onChange={handleCountryChange}
            label="Country Code"
            disabled={!canEdit}
          >
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.code}>
                {country.name} ({country.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="text"
          name="phoneNumber"
          variant="outlined"
          size="small"
          value={selectedCountryCode + formData.phoneNumber}
          onChange={(event) =>
            handleInputChange({
              target: {
                name: "phoneNumber",
                value: event.target.value.replace(selectedCountryCode, ""),
              },
            })
          }
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          fullWidth
          disabled={!canEdit}
          margin="normal"
        />
      </div>
    </div>
  );
};

export default ContactDetailsForm;
