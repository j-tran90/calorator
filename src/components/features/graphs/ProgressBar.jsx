import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function ProgressBar({
  currentValue = 0,
  targetValue = 1,
  barHeading,
  barHeight,
  barWidth,
  gradientType,
  marginTop,
  marginBottom,
}) {
  const gradients = {
    purple: {
      start: "#bb6eff",
      end: "#7a4cff",
    },
    greenYellow: {
      start: "#e5ff00",
      end: "#4fc483",
    },
    orangeRed: {
      start: "#FFA500", // Orange
      end: "#FF0000", // Red
    },
    lightBlueBlue: {
      start: "#ADD8E6", // Light Blue
      end: "#0000FF", // Blue
    },
    redRed: {
      start: "#ffb3b3", // Light Red
      end: "#ff0000", // Red
    },
  };

  const selectedGradient = gradients[gradientType] || gradients.greenYellow; // Default to greenYellow

  // Ensure targetValue is valid and prevent NaN issues
  const progress =
    targetValue > 0 ? Math.min((currentValue / targetValue) * 100, 100) : 0;

  return (
    <Box sx={{ width: `${barWidth}%`, mt: marginTop, mb: marginBottom }}>
      <Typography variant='body2'>{barHeading}</Typography>
      <LinearProgress
        variant='determinate'
        value={progress}
        sx={{
          height: `${barHeight}px`,
          borderRadius: "5px",
          backgroundColor: "#9993",
          "& .MuiLinearProgress-bar": {
            background: `linear-gradient(to right, ${selectedGradient.start}, ${selectedGradient.end})`,
            borderRadius: "5px",
          },
        }}
      />
    </Box>
  );
}
