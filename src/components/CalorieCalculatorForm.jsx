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

function CalorieCalculatorForm({ onNext, onValidationChange }) {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({
    age: false,
    height: false,
    weight: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateFields = () => {
      const newErrors = {
        age:
          !formData.age.trim() ||
          isNaN(formData.age) ||
          formData.age < 0 ||
          formData.age > 150,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    console.log("Data captured:", formData);
  };

  return (
    <form id="calorie-calculator-form" onSubmit={handleSubmit}>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          error={errors.age}
        />
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
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>
    </form>
  );
}

export default CalorieCalculatorForm;
