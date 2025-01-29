import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function ProgressBar({
  currentValue,
  targetValue,
  barHeading,
  barHeight,
  barWidth,
  gradientType,
}) {
  const gradients = {
    purple: {
      start: "#7a4cff",
      end: "#bb6eff",
    },
    greenYellow: {
      start: "#4fc483",
      end: "#e5ff00",
    },
  };

  const selectedGradient = gradients[gradientType] || gradients.greenYellow; // Default to greenYellow

  const progress = Math.min((currentValue / targetValue) * 100, 100); // Clamp progress between 0-100%

  return (
    <Box sx={{ marginTop: 2, width: `${barWidth}%` }}>
      <Typography variant='body2' gutterBottom>
        {barHeading}
      </Typography>
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
