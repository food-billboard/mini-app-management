import { useControllableValue } from 'ahooks';
import { TimePicker as AntTimePicker, Button } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import classnames from 'classnames'
import styles from './index.less'

type Value = dayjs.Dayjs[]

const TimePicker = (props: {
  value?: Value[];
  onChange?: (value: Value[]) => void;
}) => {
  const [value=[], onChange] = useControllableValue<Value[]>(props, {
    defaultValue: [],
  });

  return (
    <div>
      {
        value.map((item, index) => {
          return (
            <div className={styles['time-picker']} key={index}>
              <AntTimePicker.RangePicker
                value={item as [dayjs.Dayjs, dayjs.Dayjs]}
                onChange={data => {
                  onChange(value.map((item, ind) => {
                    if(ind === index) return data as Value
                    return item 
                  }))
                }}
              />
              <Button className='m-l-4' icon={<DeleteOutlined />} onClick={() => {
                const newValue = [...value]
                newValue.splice(index, 1)
                onChange([...newValue])
              }} />
            </div>
          ) 
        })
      }
      <Button block className={classnames(styles['add-button'], 'm-t-8')} icon={<PlusOutlined />} onClick={() => onChange([...value, []])} />
    </div>
  );
};

export default TimePicker;
