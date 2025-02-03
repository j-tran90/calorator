import { useTheme } from "@mui/material/styles";

export default function ProgressCircle({
  value,
  gradientId,
  isPercentage,
  isGram,
  targetValue,
  circleSize = 240,
}) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

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

  const backgroundColor = isDarkMode ? "#333" : "#9993";
  const innerBackgroundColor = isDarkMode ? "#1e1e1e" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";

  const cx = circleSize / 2;
  const cy = circleSize / 2;
  const r = cx - 15;
  const circleLength = 2 * Math.PI * r; // Circumference of the circle

  // Validate values
  const validValue = typeof value === "number" && !isNaN(value) ? value : 0;
  const validTargetValue =
    typeof targetValue === "number" && targetValue > 0 ? targetValue : 1;

  // Calculate the stroke offset based on value relative to target value
  const progress = Math.min(validValue, validTargetValue);
  const endValue = (1 - progress / validTargetValue) * circleLength;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          position: "relative",
        }}
      >
        <div
          style={{
            height: circleSize,
            width: circleSize,
            borderRadius: "50%",
            padding: "30px",
            backgroundColor,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              height: circleSize - 60,
              width: circleSize - 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: innerBackgroundColor,
            }}
          >
            <div
              id="number"
              style={{
                fontWeight: 600,
                fontSize: "37.5px",
                color: textColor,
              }}
            >
              {isPercentage ? `${validValue}%` : isGram ? `${validValue}g` : validValue}
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width={circleSize}
          height={circleSize}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="purple">
              <stop offset="0%" stopColor={gradients.purple.start} />
              <stop offset="100%" stopColor={gradients.purple.end} />
            </linearGradient>
            <linearGradient id="greenYellow">
              <stop offset="0%" stopColor={gradients.greenYellow.start} />
              <stop offset="100%" stopColor={gradients.greenYellow.end} />
            </linearGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="30px"
            strokeLinecap="round"
            strokeDasharray={circleLength}
            strokeDashoffset={endValue}
            transition="all 0.7s ease-in-out"
          />
        </svg>
      </div>
    </div>
  );
}
