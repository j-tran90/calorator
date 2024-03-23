import "../stylesheets/ProgressCircle.css";

export default function ProgressCircle({ percent }) {
  const cx = 80;
  const cy = 80;
  const r = 70;
  const endValue = 450 - 450 * (percent * 0.01);
  return (
    <>
      <div className="progress-cpmnt">
        <div className="progress">
          <div className="outer">
            <div className="inner">
              <div id="number">{percent}%</div>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="160px"
            height="160px"
            className="circle-svg"
          >
            <defs>
              <linearGradient id="GradientColor">
                <stop offset="0%" stopColor="#4fc483" />
                <stop offset="100%" stopColor="#e5ff00" />
              </linearGradient>
            </defs>
            <circle
              id="circle-value"
              cx={cx}
              cy={cy}
              r={r}
              strokeDashoffset={endValue}
            />
          </svg>
        </div>
      </div>
    </>
  );
}
