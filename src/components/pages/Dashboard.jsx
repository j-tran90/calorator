import { useState } from "react";
import { Box, Card, Grid2, Stack, Typography, Button } from "@mui/material";
import useTracker from "../../hooks/useTracker";
import useGoals from "../../hooks/useGoals";
import CalorieLineGraph from "../features/graphs/CalorieLineGraph";
import Header from "../navigation/Header";
import ProteinBarGraph from "../features/graphs/ProteinBarGraph";
import dayjs from "dayjs";
import CalorieCalendar from "../CalorieCalendar";
import ProgressBar from "../features/graphs/ProgressBar";
import Today from "./Today";
import { formatNutritionValue } from "../../utils/formatNutritionValue";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const {
    proteinTotal,
    proteinTarget,
    proteinPercent,
    calorieTotal,
    calorieTarget,
    caloriePercent,
    sugarTotal,
    carbsTotal,
    fatsTotal,
  } = useTracker(0);
  const {
    createdDate,
    targetDate,
    currentWeight,
    weightTarget,
    programType,
    programStatus,
  } = useGoals(0);
  const navigate = useNavigate();

  const showGraphs = false;

  return (
    <>
      <Grid2
        container
        alignItems='center'
        justifyContent='space-between'
        sx={{ m: 2, height: "50px" }}
      >
        <Grid2 size={{ xxs: 6 }}>
          <Header headText='Dashboard' />
        </Grid2>
      </Grid2>

      <Box sx={{ p: 1 }}>
        <Grid2 container spacing={{ xxs: 1, md: 3 }}>
          <Grid2 size={{ xxs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3, height: "200px" }}>
              <Typography variant='h6' sx={{ pb: 1 }}>
                {programType}{" "}
                <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                  {programStatus}
                </Typography>
              </Typography>

              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                    {dayjs(createdDate).format("MMM DD")} to{" "}
                    {dayjs(targetDate).format("MMM DD")}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ fontStyle: "italic", pb: 1 }}
                  ></Typography>
                  <Typography variant='body2'>
                    Starting {currentWeight} lbs
                  </Typography>
                  <Typography variant='body2'>
                    Target {weightTarget} lbs
                  </Typography>
                </Stack>

                <Button
                  variant='text'
                  size='small'
                  sx={{
                    display: "block",
                    mx: "auto",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    navigate("/history");
                  }}
                >
                  See History
                </Button>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3, minHeight: "200px" }}>
              <Typography variant='h6'>
                Calorie{" "}
                <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                  Target
                </Typography>
              </Typography>
              <Typography variant='h2' sx={{ pb: 2 }}>
                {calorieTarget}
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <ProgressBar
                    gradientType={
                      programType === "Gain" ? "greenYellow" : "redRed"
                    }
                    barHeading={`${formatNutritionValue(
                      calorieTotal
                    )}  (${caloriePercent}%)`}
                    barHeight={10}
                    currentValue={proteinTotal}
                    targetValue={proteinTarget}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3, minHeight: "200px" }}>
              <Typography variant='h6'>
                Protein{" "}
                <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                  Target
                </Typography>
              </Typography>
              <Typography variant='h2' sx={{ pb: 2 }}>
                {proteinTarget}g
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <Typography variant='body2' component='div'>
                    <ProgressBar
                      gradientType='purple'
                      barHeading={`${formatNutritionValue(
                        proteinTotal
                      )} (${proteinPercent}%)`}
                      barHeight={10}
                      currentValue={proteinTotal}
                      targetValue={proteinTarget}
                    />
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3, minHeight: "200px" }}>
              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <ProgressBar
                    gradientType='yellowGreen'
                    barHeading={
                      `Sugar ` + `${formatNutritionValue(sugarTotal)}`
                    }
                    barHeight={10}
                    currentValue={sugarTotal}
                    targetValue={500}
                    marginTop={2}
                  />

                  <ProgressBar
                    gradientType='orangeRed'
                    barHeading={
                      "Carbs " + `${formatNutritionValue(carbsTotal)}`
                    }
                    barHeight={10}
                    currentValue={carbsTotal}
                    targetValue={500}
                    marginTop={2}
                  />

                  <ProgressBar
                    gradientType='lightBlueBlue'
                    barHeading={`Fats ` + `${formatNutritionValue(fatsTotal)}`}
                    barHeight={10}
                    currentValue={fatsTotal}
                    targetValue={500}
                    marginTop={2}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: "20px",
                p: 1,
                maxHeight: "302px",
              }}
            >
              <Today previewCount={2} hideHeader />
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant='text'
                  size='small'
                  onClick={() => {
                    window.location.href = "/today";
                  }}
                >
                  See All
                </Button>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Calorie Calendar</Typography>
              {showGraphs ? (
                <CalorieCalendar />
              ) : (
                <Typography variant='body2' sx={{ textAlign: "center" }}>
                  Calorie Calendar temporarily disabled
                </Typography>
              )}
            </Card>
          </Grid2>

          <Grid2 size={{ xxs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: { xxs: 2, md: 3 } }}>
              {!showGraphs ? (
                <CalorieLineGraph />
              ) : (
                <Typography variant='body2' sx={{ textAlign: "center" }}>
                  Calorie Line Graph temporarily disabled
                </Typography>
              )}
            </Card>
          </Grid2>

          <Grid2 size={{ xxs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: { xxs: 2, md: 3 } }}>
              {!showGraphs ? (
                <ProteinBarGraph />
              ) : (
                <Typography variant='body2' sx={{ textAlign: "center" }}>
                  Protein Bar Graph temporarily disabled
                </Typography>
              )}
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
}
