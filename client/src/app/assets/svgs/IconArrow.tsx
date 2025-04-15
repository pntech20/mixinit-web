function IconArrow(props) {
  const { color = '#000' } = props;
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle r={11.5} transform="matrix(-1 0 0 1 12 12)" stroke={color} />
      <path
        d="M10.811 16.612a.658.658 0 01-.506-1.078l2.947-3.527-2.842-3.533a.657.657 0 01.099-.927.657.657 0 01.96.098l3.178 3.948a.657.657 0 010 .835l-3.29 3.948a.658.658 0 01-.546.236z"
        fill={color}
      />
    </svg>
  );
}

export default IconArrow;
