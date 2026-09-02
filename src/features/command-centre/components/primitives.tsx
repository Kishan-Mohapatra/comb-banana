export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const width = 72;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const id = `sp-${data.join('-')}`;
  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 2) - 1
  }));
  const line = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className ?? 'shrink-0 text-primary'}
    >
      <defs>
        <linearGradient id={id} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='currentColor' stopOpacity={0.2} />
          <stop offset='100%' stopColor='currentColor' stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill='none'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
