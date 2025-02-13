import { useControllableValue } from 'ahooks';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Result } from 'antd'
import { arrayMoveImmutable } from 'array-move'
import classnames from 'classnames'
import { SmileOutlined, PlaySquareOutlined } from '@ant-design/icons'
import styles from './index.less'

type Value = {
  url: string;
  id: string;
};

const Wrapper = (props: {
  value?: Value[];
  onChange?: (value: Value[]) => void;
}) => {
  const [value=[], onChange] = useControllableValue(props, {
    defaultValue: [],
  });

  const onDragEnd = (result: any) => {
    const {
      source,
      destination
    } = result 
    if(source.index === destination.index) {
      return 
    }
    onChange?.(arrayMoveImmutable([...value], source.index, destination.index))
  };

  if(!value.length) {
    return (
      <Result
        icon={<SmileOutlined />}
        subTitle="先上传视频吧~"
      />
    )
  }

  return (
    // @ts-ignore
    <DragDropContext onDragEnd={onDragEnd}>
      {/* @ts-ignore  */}
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div
            className="sortable-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {value.map((item: any, index: number) => {
              return (
                // @ts-ignore 
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles['sorter-item']}
                    >
                      <PlaySquareOutlined className={classnames(styles['sorter-item-icon'], 'm-r-4')} />
                      {item.url}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder as any}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Wrapper;
