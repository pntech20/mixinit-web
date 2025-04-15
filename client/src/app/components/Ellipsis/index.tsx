import './styles.scss';
import { FaEllipsisH } from 'react-icons/fa';

interface FaEllipsisHProps {
  className?: string;
  onClick?: () => void;
}

export default function Ellipsis({ className, onClick }: FaEllipsisHProps) {
  return <FaEllipsisH onClick={onClick} className={className} />;
}
