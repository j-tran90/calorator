import React, { useState, useEffect } from "react";
import { TextField, Box } from "@mui/material";

function WeightGoalForm({ onSubmit, onValidationChange }) {
  const [weightTarget, setWeightTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errors, setErrors] = useState({ weightTarget: "", targetDate: "" });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateFields = () => {
      const newErrors = {};
      const currentDate = new Date(); // Get current system date

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

      if (!targetDate.trim()) {
        newErrors.targetDate = "Target Date is required";
      } else {
        // Regular expression for mm-dd-yyyy or d-m-yyyy format
        const dateRegex = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])-\d{4}$/;
        if (!dateRegex.test(targetDate)) {
          newErrors.targetDate = "Invalid date format (mm-dd-yyyy or d-m-yyyy)";
        } else {
          // Parsing the date based on the matched format
          const [month, day, year] = targetDate.split(/-|\//); // Split by either '-' or '/'
          const enteredDate = new Date(
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
          );
          if (enteredDate <= currentDate) {
            newErrors.targetDate =
              "Target Date must be higher than the current date";
          }
        }
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
    e.preventDefault(); // Prevent default form submission

    // Convert weight target to pounds and parse it as a number
    const weightInPounds = parseFloat(weightTarget);

    // Parse the target date input into a valid Date object
    const [month, day, year] = targetDate.split("-");
    const parsedDate = new Date(`${year}-${month}-${day}`);

    // Call onSubmit function with form data
    onSubmit({ weightTarget: weightInPounds, targetDate: parsedDate });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      if (isFormValid) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Weight Target (lbs)"
          type="number"
          value={weightTarget}
          onChange={(e) => setWeightTarget(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
      </Box>
      <Box sx={{ "& > :not(style)": { mb: 2 } }}>
        <TextField
          label="Target Date (mm-dd-yyyy)"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
      </Box>
      <button type="submit" style={{ display: "none" }} />
    </form>
  );
}

export default WeightGoalForm;
