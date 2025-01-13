import { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import WeightGoalForm from "../features/BMIcalc/WeightGoalForm";
import CalorieCalculatorForm from "../features/BMIcalc/UserProfileForm";
import Results from "../features/BMIcalc/Results";
import SendDataToDB from "../../hooks/useSendDataToDB";

function CreateGoal() {
  const [activeStep, setActiveStep] = useState(0);
  const [weightGoal, setWeightGoal] = useState({});
  const [calorieData, setCalorieData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedWeightGoal = localStorage.getItem("weightGoal");
    const storedCalorieData = localStorage.getItem("calorieData");

    if (storedWeightGoal) setWeightGoal(JSON.parse(storedWeightGoal));
    if (storedCalorieData) setCalorieData(JSON.parse(storedCalorieData));
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem("weightGoal");
    localStorage.removeItem("calorieData");
  };

  const handleWeightGoalSubmit = (data) => {
    const currentDate = new Date().toISOString().split("T")[0];

    const updatedData = {
      weightTarget: data.weightTarget,
      targetDate: data.targetDate,
      createdDate: currentDate,
    };

    setWeightGoal(updatedData);
    localStorage.setItem("weightGoal", JSON.stringify(updatedData));
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleCalorieCalculatorNext = (data) => {
    setCalorieData(data);
    localStorage.setItem("calorieData", JSON.stringify(data));
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleNext = () => {
    if (isFormValid) {
      const form =
        activeStep === 0
          ? document.getElementById("calorie-calculator-form")
          : document.getElementById("weight-goal-form");
      if (form.checkValidity()) form.requestSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    clearLocalStorage();
    setActiveStep(0);
    setIsFormValid(false);
  };

  const handleFinishToDashboard = async () => {
    setLoading(true);
    try {
      await SendDataToDB();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error finishing to dashboard: ", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Provide Personal Information", // Changed order
    "Set Weight Goal", // Changed order
    "View Results",
  ];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CalorieCalculatorForm
            onNext={handleCalorieCalculatorNext}
            onValidationChange={setIsFormValid}
          />
        );
      case 1:
        return (
          <WeightGoalForm
            onSubmit={handleWeightGoalSubmit}
            onValidationChange={setIsFormValid}
          />
        );
      case 2:
        return (
          <div>
            <Results />
            <Box display='flex' justifyContent='space-between'>
              <Button onClick={handleReset}>Reset</Button>
              <Button
                variant='contained'
                color='primary'
                onClick={handleFinishToDashboard}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Finish to Dashboard"
                )}
              </Button>
            </Box>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ marginBottom: "30px" }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            {activeStep !== steps.length - 1 && (
              <Box display='flex' justifyContent='space-between'>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant='contained'
                  onClick={handleNext}
                  disabled={!isFormValid}
                >
                  Next
                </Button>
              </Box>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateGoal;
