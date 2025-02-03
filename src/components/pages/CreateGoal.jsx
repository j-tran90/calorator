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
import UserProfileForm from "../features/BMIcalc/UserProfileForm";
import Results from "../features/BMIcalc/Results";
import SendDataToDB from "../../hooks/useSendDataToDB";

function CreateGoal() {
  const [activeStep, setActiveStep] = useState(0);
  const [weightGoal, setWeightGoal] = useState({});
  const [calorieData, setCalorieData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedWeightGoal = localStorage.getItem("weightGoal");
    const storedCalorieData = localStorage.getItem("calorieData");

    console.log("Retrieved weightGoal from localStorage:", storedWeightGoal);
    console.log("Retrieved calorieData from localStorage:", storedCalorieData);

    if (storedWeightGoal) setWeightGoal(JSON.parse(storedWeightGoal));
    if (storedCalorieData) setCalorieData(JSON.parse(storedCalorieData));
  }, []);

  const clearLocalStorage = () => {
    console.log("Clearing localStorage data...");
    localStorage.removeItem("weightGoal");
    localStorage.removeItem("calorieData");
  };

  const handleWeightGoalSubmit = (data) => {
    const currentDate = new Date().toISOString().split("T")[0];

    const updatedData = {
      currentWeight: data.currentWeight,
      weightTarget: data.weightTarget,
      targetDate: data.targetDate,
      createdDate: currentDate,
    };

    setWeightGoal(updatedData);
    localStorage.setItem("weightGoal", JSON.stringify(updatedData));
    console.log("Saved weightGoal to localStorage:", updatedData);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleCalorieCalculatorNext = (data) => {
    if (data.step === 1) {
      // Navigate to step 1 explicitly
      setActiveStep(1);
    } else {
      // Save data and proceed to the next step
      setCalorieData(data);
      localStorage.setItem("calorieData", JSON.stringify(data));
      console.log("Saved calorieData to localStorage:", data);
      setActiveStep((prevStep) => prevStep + 1);
    }
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
      console.log("Data successfully sent to database.");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error finishing to dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Create Profile", "Set Weight Goal", "View Results"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <UserProfileForm
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
            <Box sx={{ mt: 10, mb: 10 }}>
              <Results />
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Button onClick={handleReset}>Reset</Button>
              <Button
                variant='contained'
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
    <Box
      sx={{
        p: 2,
        mr: "auto",
        ml: "auto",
        mt: 6,
        maxWidth: { md: "1280px" },
        overflow: { xs: "hidden", md: "auto" },
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: "30px",
        }}
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
    </Box>
  );
}

export default CreateGoal;
