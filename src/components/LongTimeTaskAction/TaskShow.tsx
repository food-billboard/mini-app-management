import { Button } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import {  } from '@/services'
import { getCallbackMap } from './utils';

const TaskShow = (props: { value: API_MEDIA.IGetLongTimeTaskListData, onClose: () => void }) => {
  const { value, onClose } = props;
  const { checked, status, page } = value;

  const [visible, setVisible] = useState(false);

  const Result = useMemo(() => {
    const [pageId] = page.split('(');
    return getCallbackMap()[pageId];
  }, [page]);

  const handleVisible = useCallback(() => {
    setVisible(true);
  }, []);

  if (status !== 'SUCCESS') {
    return null;
  }

  return (
    <>
      <Button type="link" style={{ paddingLeft: 0 }} onClick={handleVisible}>
        查看
      </Button>
      {Result && (
        <Result
          visible={visible}
          onClose={() => setVisible(false)}
          value={value}
          onModalClose={onClose}
        />
      )}
    </>
  );
};

export default TaskShow;
