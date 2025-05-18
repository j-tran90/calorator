import { Box, Card, Grid2, Stack, Typography } from "@mui/material";
import useTracker from "../../hooks/useTracker";
import useGoals from "../../hooks/useGoals";
import CalorieLineGraph from "../features/graphs/CalorieLineGraph";
import ProgressCircle from "../features/graphs/ProgressCircle";
import Header from "../navigation/Header";
import ProteinBarGraph from "../features/graphs/ProteinBarGraph";
import dayjs from "dayjs";
import CalorieCalendar from "../CalorieCalendar";
import ProgressBar from "../features/graphs/ProgressBar";

export default function Dashboard() {
  const {
    proteinTotal,
    proteinTarget,
    proteinPercent,
    calorieTotal,
    calorieTarget,
    caloriePercent,
  } = useTracker(0);
  const { createdDate, targetDate, currentWeight, weightTarget, programType } =
    useGoals(0);

  //PLACEHOLDER DELETE WHEN REPLACE
  const placeholder1 = 10;
  const placeholder2 = 55;
  const placeholder3 = 33;

  const showGraphs = false; // Set to `true` to enable graphs

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
            <Card sx={{ borderRadius: "20px", p: 3, minHeight: "200px" }}>
              <Typography variant='h6' sx={{ pb: 1 }}>
                Gain{" "}
                <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                  Program
                </Typography>
              </Typography>

              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <Typography variant='body2' sx={{ fontWeight: "bold" }}>
                    {dayjs(createdDate).format("MMM DD")} to{" "}
                    {dayjs(targetDate).format("MMM DD")}
                  </Typography>
                  <Typography variant='body2' sx={{ fontStyle: "italic" }}>
                    In Progress
                  </Typography>
                  <Typography variant='body2'>
                    Starting {currentWeight} lbs
                  </Typography>
                  <Typography variant='body2'>
                    Desired {weightTarget} lbs
                  </Typography>
                </Stack>
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
              <Typography variant='h2'>{calorieTarget}</Typography>
              <Box sx={{ textAlign: "left" }}>
                <Stack>
                  <Typography variant='body2'>
                    Today {calorieTotal} kcals ({caloriePercent}%)
                  </Typography>
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
                      barHeading={`Today ${proteinTotal}g (${proteinPercent}%)`}
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
                    barHeading={`Sugar (g)`}
                    barHeight={10}
                    currentValue={placeholder1}
                    targetValue={proteinTarget}
                    marginTop={2}
                  />

                  <ProgressBar
                    gradientType='orangeRed'
                    barHeading={"Carbs (g)"}
                    barHeight={10}
                    currentValue={placeholder2}
                    targetValue={proteinTarget}
                    marginTop={2}
                  />

                  <ProgressBar
                    gradientType='lightBlueBlue'
                    barHeading={`Fats (g)`}
                    barHeight={10}
                    currentValue={placeholder3}
                    targetValue={proteinTarget}
                    marginTop={2}
                  />
                </Stack>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xxs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6' sx={{ pb: 2 }}>
                Calories{" "}
                <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                  Today
                </Typography>
              </Typography>
              {!showGraphs ? (
                <ProgressCircle
                  value={caloriePercent}
                  gradientId='greenYellow'
                  isPercentage={true}
                  targetValue={100}
                />
              ) : (
                <Typography variant='body2' sx={{ textAlign: "center" }}>
                  Graph temporarily disabled
                </Typography>
              )}
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
              {showGraphs ? (
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
