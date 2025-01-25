export default function CalorieCircle({ percent }) {
  const cx = 120;
  const cy = 120;
  const r = 105;
  const endValue = 675 - 675 * (percent * 0.01);

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
    stroke: "url(#GradientColor)",
    strokeWidth: "30px",
    strokeLinecap: "round",
    strokeDasharray: "675",
    transition: "all 0.7s ease-in-out",
  };

  return (
    <>
      <div style={progressStyle}>
        <div style={circleStyle}>
          <div style={outerStyle}>
            <div style={innerStyle}>
              <div id='number' style={numberStyle}>
                {percent}%
              </div>
            </div>
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            version='1.1'
            width='240px'
            height='240px'
            style={svgStyle}
          >
            <defs>
              <linearGradient id='GradientColor'>
                <stop offset='0%' stopColor='#4fc483' />
                <stop offset='100%' stopColor='#e5ff00' />
              </linearGradient>
            </defs>
            <circle
              id='circle-value'
              cx={cx}
              cy={cy}
              r={r}
              style={{ ...circleValueStyle, strokeDashoffset: endValue }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}
