import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button } from 'antd';
import { generateVideoPoster } from '@/services';

const ConfirmModal = forwardRef(
  (
    props: {
      onOk?: () => void;
      onCancel?: () => void;
    },
    ref,
  ) => {
    const { onOk, onCancel: propsOnCancel } = props;

    const [visible, setVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('');
    const [ loading, setLoading ] = useState<boolean>(false)

    const onCancel = useCallback(() => {
      setVisible(false);
      propsOnCancel?.();
    }, [propsOnCancel]);

    const open = useCallback((id: string) => {
      setActiveKey(id);
      setVisible(true);
    }, []);

    const requestPoster = useCallback(
      async (cover: boolean) => {
        setLoading(true)
        await generateVideoPoster({
          _id: activeKey,
          overlap: cover,
        })
        .then(_ => {
          setVisible(false);
          onOk?.();
        })
        .catch(_ => {

        })
        .then(_ => {
          setLoading(false)
        })
      },
      [activeKey, onOk],
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          open,
        };
      },
      [open],
    );

    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button onClick={onCancel} key="cancel">
            取消
          </Button>,
          <Button loading={loading} onClick={requestPoster.bind(null, false)} key="not">
            否
          </Button>,
          <Button type='primary' loading={loading} onClick={requestPoster.bind(null, true)} key="yes">
            是
          </Button>,
        ]}
        title="提示"
      >
        是否在存在的情况下覆盖原截图
      </Modal>
    );
  },
);

export default ConfirmModal;
