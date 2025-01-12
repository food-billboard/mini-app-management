import { preview as imagePreview } from '@/components/ImagePreview';
import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { preview } from '@/components/VideoPreview';
import {
  deleteMedia,
  getMediaList,
  getMediaValid,
  updateMedia,
} from '@/services';
import { MEDIA_TYPE_MAP, sleep } from '@/utils';
import type { ActionType } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { noop } from 'lodash';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { connect } from 'umi';
import column from './columns';
import AddModal from './components/AddModal';
import type { IFormRef } from './components/CreateForm';
import CreateForm from './components/CreateForm';
import type { ListModalRef } from './components/ListModal';
import ListModal, { formatData } from './components/ListModal';
import ConfirmModal from './components/PosterGenerate';
import { mapDispatchToProps, mapStateToProps } from './connect';

const MediaManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);
  const listModalRef = useRef<ListModalRef>(null);
  const posterRef = useRef<any>(null);

  const [activeKey, setActiveKey] = useState('image');

  const handleAdd = useCallback(
    async (fields: any) => {
      const hide = message.loading('正在修改');

      const params = {
        ...fields,
        type: MEDIA_TYPE_MAP[activeKey],
      };

      try {
        await updateMedia(params);
        hide();
        message.success('操作成功');
        return true;
      } catch (error) {
        hide();
        message.error('操作失败请重试！');
        return false;
      }
    },
    [activeKey],
  );

  const getDetail = useCallback(
    (record: API_MEDIA.IGetMediaListData) => {
      const { src } = record;
      if (activeKey === 'image') {
        imagePreview([src]);
      } else if (activeKey === 'video') {
        preview([src], {});
      } else {
        message.info('功能开发中');
      }
    },
    [activeKey],
  );

  const handleRemove = useCallback(
    async (selectedRows: API_MEDIA.IGetMediaListData[]) => {
      try {
        for (let i = 0; i < selectedRows.length; i++) {
          const { _id } = selectedRows[i];
          await deleteMedia({
            _id,
            type: MEDIA_TYPE_MAP[activeKey] as any,
          });
        }
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [activeKey],
  );

  const getProcess = useCallback(
    async (id: string | string[]) => {
      let hide: any = noop;
      const idList = Array.isArray(id) ? id.join(',') : id;
      return new Promise<boolean>((resolve) => {
        Modal.confirm({
          okText: '是',
          cancelText: '否',
          title: '提示',
          content: '如果该资源未完成，是否自动删除??',
          onCancel: (close) => {
            close();
            resolve(false);
          },
          onOk: (close) => {
            close();
            resolve(true);
          },
        });
      })
        .then((isDelete: boolean) => {
          hide = message.loading('正在检查');
          return getMediaValid({
            isdelete: isDelete,
            type: MEDIA_TYPE_MAP[activeKey] as any,
            _id: idList,
          });
        })
        .then((data) => {
          if (data.length === 1) {
            const [target] = data;
            const { message: messageData } = formatData(target);
            message.info(messageData);
          } else {
            listModalRef.current?.open(data);
          }
          hide();
        })
        .then(() => {
          actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          hide();
          message.info('操作失败，请重试');
        });
    },
    [activeKey, actionRef, listModalRef],
  );

  const handleModalVisible = (value: API_MEDIA.IGetMediaListData) => {
    modalRef.current?.open(value);
  };

  const generatePoster = useCallback(async (id: string) => {
    posterRef.current?.open(id);
  }, []);

  const columns: any[] = useMemo(() => {
    return activeKey === 'video'
      ? column
      : column.filter((item) => item.dataIndex !== 'poster');
  }, [activeKey]);

  const onSubmit = useCallback(
    async (value) => {
      const success = await handleAdd(value);
      if (success) {
        actionRef.current?.reload();
        return Promise.resolve();
      }
      return Promise.reject();
    },
    [activeKey],
  );

  const fetchData = useCallback(
    async (params: any) => {
      const { current, size, minSize, maxSize, ...nextParams } = params;
      const newParams = {
        ...nextParams,
        type: MEDIA_TYPE_MAP[activeKey] as any,
        currPage: current - 1,
      };
      if (
        typeof size === 'number' ||
        typeof minSize === 'number' ||
        typeof maxSize === 'number'
      )
        newParams.size = size ?? `${minSize},${maxSize}`;
      return getMediaList(newParams)
        .then(({ list, total }) => ({ data: list, total }))
        .catch(() => ({ data: [], total: 0 }));
    },
    [activeKey],
  );

  const onTabChange = useCallback(
    async (newActiveKey: string) => {
      setActiveKey(newActiveKey);
      await sleep(100);
      actionRef.current?.reload();
    },
    [actionRef],
  );

  return (
    <ProPage
      containerProps={{
        tabList: [
          {
            tab: '图片资源',
            key: 'image',
            closable: false,
          },
          {
            tab: '视频资源',
            key: 'video',
            closable: false,
          },
          {
            tab: '其他资源',
            key: 'other',
            closable: false,
          },
        ],
        tabProps: {
          onChange: onTabChange,
          activeKey,
        },
      }}
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      extraActionRender={(record) => {
        const commonProps: any = {
          type: 'link',
          style: {
            paddingLeft: 0,
          },
        };
        return (
          <>
            <Button {...commonProps} onClick={() => handleModalVisible(record)}>
              编辑
            </Button>
            <Button {...commonProps} onClick={getDetail.bind(null, record)}>
              查看
            </Button>
            <Button
              {...commonProps}
              onClick={getProcess.bind(null, record['_id'])}
            >
              完成度检测
            </Button>
            {activeKey === 'video' && (
              <Button
                {...commonProps}
                onClick={generatePoster.bind(null, record['_id'])}
              >
                海报生成
              </Button>
            )}
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="媒体资源列表"
      pagination={{ defaultPageSize: 10 }}
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={(action, { selectedRows = [] }) => [
        <AddModal
          key="add"
          type={activeKey}
          onAdd={() => actionRef.current?.reloadAndRest?.()}
        />,
        <Button
          disabled={!selectedRows.length}
          key="check"
          onClick={() => {
            getProcess(selectedRows.map((item) => item['_id']));
          }}
        >
          批量检测
        </Button>,
      ]}
      tableAlertRender={({
        selectedRowKeys,
      }: {
        selectedRowKeys: React.Key[];
        selectedRows: any[];
      }) => (
        <div>
          已选择{' '}
          <a
            style={{
              fontWeight: 600,
            }}
          >
            {selectedRowKeys.length}
          </a>{' '}
          项&nbsp;&nbsp;
        </div>
      )}
      request={fetchData}
      columns={columns}
      rowSelection={{}}
    >
      <CreateForm onSubmit={onSubmit} ref={modalRef} />
      <ListModal ref={listModalRef} />
      <ConfirmModal
        ref={posterRef}
        onOk={() => actionRef.current?.reloadAndRest?.()}
      />
    </ProPage>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaManage);
