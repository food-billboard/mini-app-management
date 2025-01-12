import React, { useCallback, useMemo, useRef } from 'react';
import { Button } from 'antd';
import { message } from '@/components/Toast';
import type { MEDIA_TYPE_MAP } from '@/utils';
import { uploadFile } from '../../../Screen/utils';

const AddModal = (props: { type: keyof typeof MEDIA_TYPE_MAP; onAdd?: () => any }) => {
  const { onAdd, type } = props;

  const uploadLoading = useRef(false);

  const acceptType = useMemo(() => {
    if (type === 'image') {
      return 'image/*';
    } else if (type === 'video') {
      return 'video/*';
    } else {
      return '*';
    }
  }, [type]);

  const handleUpload = useCallback(() => {
    uploadFile({
      accept: acceptType,
      beforeUpload: () => {
        return !uploadLoading.current;
      },
      upload: () => {
        uploadLoading.current = true;
        message.info('资源上传中...');
      },
      callback: () => {
        uploadLoading.current = false;
        onAdd?.();
      },
    });
  }, [onAdd, acceptType]);

  return (
    <Button type="primary" onClick={handleUpload}>
      新增资源
    </Button>
  );
};

export default AddModal;
