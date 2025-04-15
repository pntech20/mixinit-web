import React, { useCallback } from 'react';
import ItemsTemplate from './ItemsTemplate';
import { useDragLayer } from 'react-dnd';
import classNames from 'classnames';
import styles from './mediaUploads.module.scss';

const getItemStyles = currentOffset => {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
};

export default function FieldDragLayer(props) {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }),
  );

  const renderItem = useCallback((type, item) => {
    switch (type) {
      case 'ITEM':
        return <ItemsTemplate fields={item.fields} />;
      default:
        return null;
    }
  }, []);

  if (!isDragging) {
    return null;
  }

  return (
    <div className={styles.layerStyles}>
      <div style={getItemStyles(currentOffset)}>
        <div
          className={classNames(styles.currentOffset, {
            [styles.opacityItem]: isDragging,
          })}
        >
          {renderItem(itemType, item)}
        </div>
      </div>
    </div>
  );
}
