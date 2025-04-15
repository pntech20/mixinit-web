import { useColorModeValue } from '@chakra-ui/react';

const ShowHideColumn = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.25 0H2.75C1.23338 0 0 1.23338 0 2.75V19.25C0 20.7666 1.23338 22 2.75 22H19.25C20.7666 22 22 20.7666 22 19.25V2.75C22 1.23338 20.7666 0 19.25 0ZM13.75 1.83333V20.1667H8.25V1.83333H13.75ZM1.83333 19.25V2.75C1.83333 2.24446 2.24446 1.83333 2.75 1.83333H6.41667V20.1667H2.75C2.24446 20.1667 1.83333 19.7555 1.83333 19.25ZM20.1667 19.25C20.1667 19.7555 19.7555 20.1667 19.25 20.1667H15.5833V1.83333H19.25C19.7555 1.83333 20.1667 2.24446 20.1667 2.75V19.25Z"
        fill={useColorModeValue('#242424', '#FFFFFF')}
      />
    </svg>
  );
};
export default ShowHideColumn;
