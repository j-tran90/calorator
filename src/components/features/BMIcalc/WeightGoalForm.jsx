import { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function WeightGoalForm({ onSubmit, onValidationChange }) {
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightTarget, setWeightTarget] = useState("");
  const [targetDate, setTargetDate] = useState(dayjs());
  const [errors, setErrors] = useState({
    currentWeight: "",
    weightTarget: "",
    targetDate: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateFields = () => {
      const newErrors = {};
      const currentDate = new Date();

      // Validation for current weight
      if (!currentWeight.trim()) {
        newErrors.currentWeight = "Required";
      } else if (isNaN(currentWeight)) {
        newErrors.currentWeight = "Current Weight must be a number";
      } else {
        const weight = parseFloat(currentWeight);
        if (weight < 1 || weight > 250) {
          newErrors.currentWeight = "Current Weight must be between 1 and 250";
        }
      }

      // Validation for weight target
      if (!weightTarget.trim()) {
        newErrors.weightTarget = "Required";
      } else if (isNaN(weightTarget)) {
        newErrors.weightTarget = "Weight Target must be a number";
      } else {
        const weight = parseFloat(weightTarget);
        if (weight < 1 || weight > 250) {
          newErrors.weightTarget = "Weight Target must be between 1 and 250";
        }
      }

      // Validation for target date
      if (!targetDate) {
        newErrors.targetDate = "Required";
      } else if (targetDate <= currentDate) {
        newErrors.targetDate = "Choose a future date";
      }

      return newErrors;
    };

    const errors = validateFields();
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
    setErrors(errors);
    setIsFormValid(isValid);
  }, [currentWeight, weightTarget, targetDate, onValidationChange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", {
      currentWeight: currentWeight,
      weightTarget: weightTarget,
      targetDate: targetDate.toDate(),
    }); // Log form data before submitting

    const weightInPounds = parseFloat(weightTarget);
    const currentWeightInPounds = parseFloat(currentWeight);

    if (isNaN(currentWeightInPounds)) {
      console.error("Invalid currentWeight:", currentWeight);
      return;
    }

    // Save data to localStorage
    localStorage.setItem("currentWeight", currentWeightInPounds);
    localStorage.setItem("weightTarget", weightInPounds);
    localStorage.setItem("targetDate", targetDate.toDate().toISOString());

    onSubmit({
      currentWeight: currentWeightInPounds,
      weightTarget: weightInPounds,
      targetDate: targetDate.toDate(),
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form id='weight-goal-form' onSubmit={handleSubmit}>
        <Box
          sx={{
            width: 259,
            "& > :not(style)": { mb: 2 },
          }}
        >
          <TextField
            label='Current Weight (lbs)'
            type='number'
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            fullWidth
            error={!!errors.weightTarget}
            helperText={errors.weightTarget}
          />
        </Box>
        <Box
          sx={{
            width: 259,
            "& > :not(style)": { mb: 2 },
          }}
        >
          <TextField
            label='Weight to Reach (lbs)'
            type='number'
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
              label='Date to Reach Goal'
              value={targetDate}
              onChange={(newDate) => setTargetDate(newDate)}
              sx={{ minWidth: "259px" }}
            />
          </LocalizationProvider>
          {!!errors.targetDate && (
            <div style={{ color: "red" }}>{errors.targetDate}</div>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default WeightGoalForm;
