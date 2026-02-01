import AsyncButton from '@/components/AsyncButton';
import { message } from '@/components/Toast';
import { getHolidayList, postHoliday } from '@/services';
import { Badge, Calendar } from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';

const HolidayManage = () => {
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [holiday, setHoliday] = useState<string[]>([]);

  const fetchData = async () => {
    return getHolidayList({
      year: currentYear,
    })
      .then((data) => {
        setHoliday(data.holiday || []);
      })
      .catch(() => ({ data: [], total: 0 }));
  };

  const onSelect = useCallback(
    (date, info) => {
      const { source } = info;
      if (source === 'year') {
        const year = date.year;
        setCurrentYear(year);
      } else if (source === 'date') {
        let newHoliday = [...holiday];
        const index = newHoliday.indexOf(date.format('YYYY-MM-DD'));
        if (!!~index) {
          newHoliday.splice(index, 1);
        } else {
          newHoliday.push(date.format('YYYY-MM-DD'));
        }
        setHoliday(newHoliday);
      }
    },
    [currentYear, holiday],
  );

  const onSubmit = useCallback(async () => {
    try {
      await postHoliday({
        year: currentYear,
        holiday: holiday,
      });
      message.success('操作成功');
      await fetchData();
      return true;
    } catch (error) {
      message.error('操作失败请重试！');
      return false;
    }
  }, [currentYear, holiday]);

  useEffect(() => {
    fetchData();
  }, [currentYear]);

  return (
    <div className={styles['holiday-manage']}>
      <div className={classnames('t-r', styles['holiday-manage-action'])}>
        <AsyncButton
          className={styles['holiday-manage-button']}
          type="primary"
          onClick={onSubmit}
        >
          提交
        </AsyncButton>
      </div>
      <Calendar
        onSelect={onSelect}
        mode="month"
        cellRender={(current) => {
          const isHoliday = holiday.includes(current.format('YYYY-MM-DD'));
          if (isHoliday) {
            return (
              <div className="t-r">
                <Badge count={'假'} />
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
};

export default HolidayManage;
