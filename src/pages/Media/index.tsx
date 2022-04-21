import React, { useRef, useCallback, memo, useMemo, useState } from 'react';
import { Button, Dropdown, message, Menu, Space, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { noop } from 'lodash';
import ImagePreview, { ImagePreviewRef } from '@/components/ImagePreview';
import { mapStateToProps, mapDispatchToProps } from './connect';
import CreateForm from './components/CreateForm';
import type { IFormRef } from './components/CreateForm';
import ListModal, { formatData } from './components/ListModal';
import type { ListModalRef } from './components/ListModal';
import ConfirmModal from './components/PosterGenerate';
import column from './columns';
import { MEDIA_TYPE_MAP, sleep } from '@/utils';
import { getMediaList, updateMedia, deleteMedia, getMediaValid } from '@/services';
import { commonDeleteMethod } from '@/utils';

const MediaManage = memo(() => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<IFormRef>(null);
  const listModalRef = useRef<ListModalRef>(null);
  const posterRef = useRef<any>(null);
  const previewRef = useRef<ImagePreviewRef>(null)

  const [activeKey, setActiveKey] = useState<keyof typeof MEDIA_TYPE_MAP>('image');

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
      const { src } = record 
      if(activeKey === 'image') {
        previewRef.current?.open(src)
      }else {
        const urls = Array.isArray(src) ? src : [src];
        return history.push({
          pathname: `/media/${activeKey}`,
          query: {
            url: urls,
          },
        });
      }
    },
    [activeKey],
  );

  const handleRemove = useCallback(
    async (selectedRows: API_MEDIA.IGetMediaListData[]) => {
      return commonDeleteMethod<API_MEDIA.IGetMediaListData>(
        selectedRows,
        (row: API_MEDIA.IGetMediaListData) => {
          const { _id } = row;
          return deleteMedia({
            _id,
            type: MEDIA_TYPE_MAP[activeKey] as any,
          });
        },
        actionRef.current?.reloadAndRest,
      );
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
    const newColumn =
      activeKey === 'video' ? column : column.filter((item) => item.dataIndex !== 'poster');
    return [
      ...newColumn,
      {
        title: '操作',
        key: 'option',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        render: (_: any, record: API_MEDIA.IGetMediaListData) => {
          return (
            <Space>
              <a onClick={() => handleModalVisible(record)}>编辑</a>
              <a style={{ color: 'red' }} onClick={() => handleRemove([record])}>
                删除
              </a>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <a style={{ color: '#1890ff' }} onClick={getDetail.bind(null, record)}>
                        查看
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        style={{ color: '#1890ff' }}
                        onClick={getProcess.bind(null, record['_id'])}
                      >
                        完成度检测
                      </a>
                    </Menu.Item>
                    {activeKey === 'video' && (
                      <Menu.Item>
                        <a
                          style={{ color: '#1890ff' }}
                          onClick={generatePoster.bind(null, record['_id'])}
                        >
                          海报生成
                        </a>
                      </Menu.Item>
                    )}
                  </Menu>
                }
              >
                <a onClick={(e) => e.preventDefault()}>
                  <EllipsisOutlined />
                </a>
              </Dropdown>
            </Space>
          );
        },
      },
    ];
  }, [getDetail, handleRemove, getProcess, activeKey]);

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
      if (typeof size === 'number' || typeof minSize === 'number' || typeof maxSize === 'number')
        newParams.size = size ?? `${minSize},${maxSize}`;
      return getMediaList(newParams)
        .then(({ list, total }) => ({ data: list, total }))
        .catch(() => ({ data: [], total: 0 }));
    },
    [activeKey],
  );

  const onTabChange = useCallback(
    async (newActiveKey: string) => {
      setActiveKey(newActiveKey as keyof typeof MEDIA_TYPE_MAP);
      await sleep(100);
      actionRef.current?.reload();
    },
    [actionRef],
  );

  return (
    <PageContainer
      tabList={[
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
      ]}
      tabProps={{
        onChange: onTabChange,
        activeKey,
      }}
    >
      <ProTable
        scroll={{ x: 'max-content' }}
        headerTitle="媒体资源列表"
        pagination={{ defaultPageSize: 10 }}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                    } else if (e.key === 'valid') {
                      await getProcess(selectedRows.map((item) => item['_id']));
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="valid">批量检测</Menu.Item>
                </Menu>
              }
            >
              <Button key="many">
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({
          selectedRowKeys,
        }: {
          selectedRowKeys: React.ReactText[];
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
      />
      <CreateForm onSubmit={onSubmit} ref={modalRef} />
      <ListModal ref={listModalRef} />
      <ConfirmModal ref={posterRef} onOk={() => actionRef.current?.reloadAndRest?.()} />
      <ImagePreview
        ref={previewRef}
      />
    </PageContainer>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaManage);
