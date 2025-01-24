import { useState, useEffect } from "react";
import {
  TextField,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Correct import
import dayjs from "dayjs";

function UserProfileForm({ onNext, onValidationChange }) {
  const [formData, setFormData] = useState({
    dob: null, // Date of birth field
    height: "",
    weight: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({
    dob: false,
    height: false,
    weight: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate the fields
  useEffect(() => {
    const validateFields = () => {
      const newErrors = {
        dob: !formData.dob,
        height:
          !formData.height.trim() ||
          isNaN(formData.height) ||
          formData.height < 50 ||
          formData.height > 400,
        weight:
          !formData.weight.trim() ||
          isNaN(formData.weight) ||
          formData.weight < 1 ||
          formData.weight > 500,
      };

      return newErrors;
    };

    const newErrors = validateFields();
    const isValid = !Object.values(newErrors).some((error) => error);
    onValidationChange(isValid);
    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formData, onValidationChange]);

  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: newDate,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const dobFormatted = formData.dob
      ? dayjs(formData.dob).format("YYYY-MM-DD")
      : null; // Only format if a date exists

    const dataToSave = {
      dob: dobFormatted, // Store dob in YYYY-MM-DD format
      height: formData.height,
      weight: formData.weight,
      gender: formData.gender,
    };

    // Save the data into localStorage
    console.log("Saving data to localStorage", dataToSave); // Add this line to confirm data is being saved
    localStorage.setItem("calorieData", JSON.stringify(dataToSave));

    onNext(formData);
    console.log("Data captured:", formData);
};


  return (
    <form id="calorie-calculator-form" onSubmit={handleSubmit}>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={formData.dob}
            onChange={handleDateChange}
            textField={(params) => (
              <TextField {...params} fullWidth error={errors.dob} />
            )}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Height (cm)"
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          fullWidth
          error={errors.height}
        />
      </Box>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Weight (lbs)"
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          fullWidth
          error={errors.weight}
        />
      </Box>
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          sx={{ display: "flex", flexDirection: "row" }} // Align horizontally
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>
    </form>
  );
}

export default UserProfileForm;
