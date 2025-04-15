interface IconProps {
  textColor?: string;
  className?: string;
  color?: string;
}

function IconFacebook({ textColor }: IconProps) {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14.1106C0 21.087 5.06681 26.8881 11.6935 28.0645V17.9297H8.18548V14.0322H11.6935V10.9136C11.6935 7.40552 13.9539 5.45737 17.1509 5.45737C18.1636 5.45737 19.2558 5.6129 20.2684 5.76842V9.35483H18.4758C16.7603 9.35483 16.371 10.212 16.371 11.3041V14.0322H20.1129L19.4896 17.9297H16.371V28.0645C22.9977 26.8881 28.0645 21.0881 28.0645 14.1106C28.0645 6.34959 21.75 0 14.0322 0C6.31451 0 0 6.34959 0 14.1106Z"
        fill={textColor}
      />
    </svg>
  );
}

export default IconFacebook;
