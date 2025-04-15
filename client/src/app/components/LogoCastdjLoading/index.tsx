import styles from './logoCastdjLoading.module.scss';
import LoadingIcon from '../../assets/images/common/logoCastdj.png';

interface LoadingProps {
  url?: string;
}

export default function Loading({ url }: LoadingProps) {
  return (
    <div className={styles.wrapLoading}>
      <div className="loading">
        <img src={url || LoadingIcon} alt="loading" className="icon" />
      </div>
    </div>
  );
}
