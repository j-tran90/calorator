import { useTheme } from "@mui/material/styles";

export default function ProgressLegend({ total, remaining }) {
  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const remainingColor = theme.palette.mode === "dark" ? "#666" : "#9993";

  return (
    <div>
      <svg
        className="progress-legend"
        version="1.1"
        width="300"
        height="45"
        viewBox="0 0 60 1"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Consumed Section */}
        <rect
          x="1"
          y="1"
          width="4"
          height="2"
          fill="#4fc483"
          ry="1"
          rx="1"
        />
        <text
          x="6"
          y="2.3"
          fontSize="2.5"
          alignmentBaseline="middle"
          fill={textColor} // Adjust text color for dark mode
        >
          Consumed {total}
        </text>

        {/* Remaining Section */}
        <rect
          x="30"
          y="1"
          width="4"
          height="2"
          fill={remainingColor} // Adjust remaining color for dark mode
          ry="1"
          rx="1"
        />
        <text
          x="35"
          y="2.3"
          fontSize="2.5"
          alignmentBaseline="middle"
          fill={textColor} // Adjust text color for dark mode
        >
          Remaining {remaining}
        </text>
      </svg>
    </div>
  );
}
