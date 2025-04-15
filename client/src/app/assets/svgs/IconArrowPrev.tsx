function IconArrowPrev(props) {
  const { color } = props;
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={12} cy={12} r={11.5} stroke={color} />
      <path
        d="M13.189 16.612a.658.658 0 00.506-1.078l-2.947-3.527 2.842-3.533a.657.657 0 00-.099-.927.657.657 0 00-.96.098l-3.178 3.948a.658.658 0 000 .835l3.29 3.948a.658.658 0 00.546.236z"
        fill={color}
      />
    </svg>
  );
}

export default IconArrowPrev;
