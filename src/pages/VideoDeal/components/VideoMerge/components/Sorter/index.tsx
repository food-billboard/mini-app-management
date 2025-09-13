import { useControllableValue, useDebounceEffect, useDeepCompareEffect } from 'ahooks';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Result } from 'antd'
import { arrayMoveImmutable } from 'array-move'
import classnames from 'classnames'
import { SmileOutlined, PlaySquareOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useEffect, useRef, useState } from 'react';
import { getMediaDetail } from '@/services'

const Wrapper = (props: {
  value?: string[];
  onChange?: (value: string[]) => void;
}) => {
  const [value=[], onChange] = useControllableValue(props, {
    defaultValue: [],
  });

  const [sortList, setSortList] = useState<API_MEDIA.IGetMediaListData[]>([])

  const mediaDetailMap = useRef<any>({})

  const onDragEnd = (result: any) => {
    const {
      source,
      destination
    } = result 
    if(source.index === destination.index) {
      return 
    }
    console.log(onChange)
    onChange?.(arrayMoveImmutable([...value], source.index, destination.index))
  };

  useDebounceEffect(() => {
    console.log(value, 27777)
    async function fetchData() {
      let data: API_MEDIA.IGetMediaListData[] = []
      for(let index = 0; index < value.length; index ++) {
        if(mediaDetailMap.current[value[index]]) {
          data.push(mediaDetailMap.current[value[index]])
        }else {
          await getMediaDetail({
            _id: value[index],
            type: 'video'
          })
          .then(res => {
            const [target] = res 
            console.log(res)
            data.push(target)
            mediaDetailMap.current[value[index]] = target 
          })
        }
      }
      setSortList(data)
    }
    fetchData()
  }, [value], {
    wait: 400
  })

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
            {sortList.map((item, index: number) => {
              return (
                // @ts-ignore 
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles['sorter-item']}
                    >
                      <PlaySquareOutlined className={classnames(styles['sorter-item-icon'], 'm-r-4')} />
                      <video controls style={{width: 320, height: 180}} src={item.src} autoPlay={false} />
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
