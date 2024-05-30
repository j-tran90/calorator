import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import WeightGoalForm from "../components/WeightGoalForm";
import CalorieCalculatorForm from "../components/CalorieCalculatorForm";
import Results from "../components/Results";
import SendDataToDB from "../hooks/useSendDataToDB";
import User from "../components/User";

function CreateGoal() {
  const [activeStep, setActiveStep] = useState(0);
  const [weightGoal, setWeightGoal] = useState({});
  const [calorieData, setCalorieData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const clearLocalStorage = () => {
    localStorage.removeItem("weightGoal");
    localStorage.removeItem("calorieData");
  };

  const handleWeightGoalSubmit = (data) => {
    setWeightGoal(data);
    console.log("Weight goal data captured:", data);
    localStorage.setItem(
      "weightGoal",
      JSON.stringify({
        weightTarget: data.weightTarget,
        targetDate: data.targetDate,
      })
    );
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCalorieCalculatorNext = (data) => {
    setCalorieData(data);
    console.log("Calorie calculator data captured:", data);
    localStorage.setItem(
      "calorieData",
      JSON.stringify({
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
      })
    );
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const steps = [
    "Set Weight Goal",
    "Provide Personal Information",
    "View Results",
  ];

  const handleReset = () => {
    clearLocalStorage();
    setActiveStep(0);
    setIsFormValid(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <WeightGoalForm
            onSubmit={handleWeightGoalSubmit}
            onValidationChange={setIsFormValid}
          />
        );
      case 1:
        return (
          <CalorieCalculatorForm
            onNext={handleCalorieCalculatorNext}
            onValidationChange={setIsFormValid}
          />
        );
      case 2:
        return (
          <div>
            <Results />
            <Box display="flex" justifyContent="space-between">
              <Button onClick={handleReset}>Reset</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinishToDashboard}
              >
                Finish to Dashboard
              </Button>
            </Box>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (isFormValid) {
      const form =
        activeStep === 0
          ? document.getElementById("weight-goal-form")
          : document.getElementById("calorie-calculator-form");
      form.requestSubmit();
    }
  };

  const handleFinishToDashboard = async () => {
    try {
      await SendDataToDB();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error finishing to dashboard: ", error);
    }
  };

  return (
    <div>
      <User />
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ marginBottom: "30px" }}
      >
        {steps.map((label) => (
          <Step
            key={label}
            sx={{
              "& .MuiStepLabel-root .Mui-completed": {
                color: "#4fc483", // circle color (COMPLETED)
              },
              "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                {
                  color: "grey.500", // Just text label (COMPLETED)
                },
              "& .MuiStepLabel-root .Mui-active": {
                color: "#4fc483", // circle color (ACTIVE)
              },
              "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                {
                  color: "#4fc483", // Just text label (ACTIVE)
                },
              "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                fill: "white", // circle's number (ACTIVE)
              },
            }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
            <Button onClick={clearLocalStorage}>Reset</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            {activeStep !== steps.length - 1 && (
              <Box display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
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
