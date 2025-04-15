import styles from './mediaUploads.module.scss';

const ItemsTemplate = ({ fields }) => {
  const rows = fields.map(field => (
    <div key={field._id} className={styles.itemTemplate}>
      {field.title}
    </div>
  ));
  return <div>{rows}</div>;
};

export default ItemsTemplate;
