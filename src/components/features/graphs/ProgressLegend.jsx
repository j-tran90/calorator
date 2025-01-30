export default function ProgressLegend({ total, remaining }) {
  return (
    <div>
      <svg
        className='progress-legend'
        version='1.1'
        width='300'
        height='45'
        viewBox='0 0 60 1'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect
          id='pill-1'
          x='1'
          y='1'
          width='4'
          height='2'
          fill='#4fc483'
          stroke=''
          strokeWidth='0.1'
          ry='1'
          rx='1'
        />
        <text x='6' y='2.3' fontSize='2.5' alignmentBaseline='middle'>
          Consumed {total}
        </text>
        <rect
          x='30'
          y='1'
          width='4'
          height='2'
          fill='#9993'
          stroke=''
          strokeWidth='0.1'
          ry='1'
          rx='1'
        />
        <text x='35' y='2.3' fontSize='2.5' alignmentBaseline='middle'>
          Remaining {remaining}
        </text>
      </svg>
    </div>
  );
}
