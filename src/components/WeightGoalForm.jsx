import { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function WeightGoalForm({ onSubmit, onValidationChange }) {
  const [weightTarget, setWeightTarget] = useState("");
  const [targetDate, setTargetDate] = useState(dayjs());
  const [errors, setErrors] = useState({ weightTarget: "", targetDate: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateFields = () => {
      const newErrors = {};
      const currentDate = new Date();

      if (!weightTarget.trim()) {
        newErrors.weightTarget = "Weight Target is required";
      } else if (isNaN(weightTarget)) {
        newErrors.weightTarget = "Weight Target must be a number";
      } else {
        const weight = parseFloat(weightTarget);
        if (weight < 1 || weight > 500) {
          newErrors.weightTarget = "Weight Target must be between 1 and 500";
        }
      }

      if (!targetDate) {
        newErrors.targetDate = "Target Date is required";
      } else if (targetDate <= currentDate) {
        newErrors.targetDate =
          "Target Date must be higher than the current date";
      }

      return newErrors;
    };

    const errors = validateFields();
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
    setErrors(errors);
    setIsFormValid(isValid);
  }, [weightTarget, targetDate, onValidationChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const weightInPounds = parseFloat(weightTarget);
    targetDate.toDate();
    onSubmit({ weightTarget: weightInPounds, targetDate });
    console.log("weight", weightInPounds, targetDate);
  };

  return (
    <form id="weight-goal-form" onSubmit={handleSubmit}>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Weight Target (lbs)"
          type="number"
          value={weightTarget}
          onChange={(e) => setWeightTarget(e.target.value)}
          fullWidth
          error={!!errors.weightTarget}
          helperText={errors.weightTarget}
        />
      </Box>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Target Date"
            value={targetDate}
            onChange={(newDate) => setTargetDate(newDate)}
          />
        </LocalizationProvider>
      </Box>
    </form>
  );
}

export default WeightGoalForm;
