export default function ProgressCircle({
  value,
  gradientId,
  isPercentage,
  isGram,
  targetValue,
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

  const cx = 120;
  const cy = 120;
  const r = 105;
  const circleLength = 2 * Math.PI * r; // Circumference of the circle

  // Validate the values
  const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const validTargetValue = typeof targetValue === 'number' && targetValue > 0 ? targetValue : 1; // Prevent division by zero

  // Calculate the stroke offset based on value relative to target value
  const progress = validValue > validTargetValue ? validTargetValue : validValue;
  const endValue = (1 - progress / validTargetValue) * circleLength;

  const progressStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  };

  const circleStyle = {
    width: "240px",
    height: "240px",
    position: "relative",
  };

  const outerStyle = {
    height: "240px",
    width: "240px",
    borderRadius: "50%",
    padding: "30px",
    backgroundColor: "#9993",
    boxSizing: "border-box",
  };

  const innerStyle = {
    height: "180px",
    width: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#fff",
  };

  const numberStyle = {
    fontWeight: 600,
    fontSize: "37.5px",
    color: "#000",
  };

  const svgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
  };

  const circleValueStyle = {
    fill: "none",
    stroke: `url(#${gradientId})`,
    strokeWidth: "30px",
    strokeLinecap: "round",
    strokeDasharray: circleLength, // Full circumference
    transition: "all 0.7s ease-in-out",
  };

  let displayValue = validValue;

  // Handle the value display based on isPercentage and isGram props
  if (isPercentage) {
    displayValue = `${validValue}%`;
  } else if (isGram) {
    displayValue = `${validValue}g`;
  }

  return (
    <div style={progressStyle}>
      <div style={circleStyle}>
        <div style={outerStyle}>
          <div style={innerStyle}>
            <div id="number" style={numberStyle}>
              {displayValue}
            </div>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="240px"
          height="240px"
          style={svgStyle}
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
            id="circle-value"
            cx={cx}
            cy={cy}
            r={r}
            style={{ ...circleValueStyle, strokeDashoffset: endValue }}
          />
        </svg>
      </div>
    </div>
  );
}
