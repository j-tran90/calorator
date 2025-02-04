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

  return (
    <>
      {" "}
      <Box sx={{ pb: 2 }}>
        <Grid2 container>
          <Grid2 size={{ xs: 6 }} sx={{ pl: 2 }}>
            <Header headText='Dashboard' />
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{ p: 1 }}>
        <Grid2 container spacing={{ xs: 1, md: 3 }}>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Program</Typography>
              <Typography variant='h4'>{programType}</Typography>
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
                    Starting Weight {currentWeight} lbs
                  </Typography>
                  <Typography variant='body2'>
                    Desired Weight {weightTarget} lbs
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Calorie Target</Typography>
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
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Protein Target</Typography>
              <Typography variant='h2'>{proteinTarget}g</Typography>
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
          <Grid2 size={{ xs: 6, md: 3 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Other Contents (WIP)</Typography>
              <Typography variant='caption' sx={{ fontStyle: "italic" }}>
                Consumed Today
              </Typography>
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
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6' sx={{ pb: 2 }}>
                Today's Calorie
              </Typography>
              <ProgressCircle
                value={caloriePercent}
                gradientId='greenYellow'
                isPercentage={true}
                targetValue={100}
              />
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <Typography variant='h6'>Calorie Calendar</Typography>
              <CalorieCalendar />
            </Card>
          </Grid2>{" "}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <CalorieLineGraph />
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "20px", p: 3 }}>
              <ProteinBarGraph />
            </Card>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
}
