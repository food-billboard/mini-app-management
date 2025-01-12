import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import {
  deleteRaspberry,
  getRaspberryList,
  postRaspberry,
  putRaspberry,
  rebuildRaspberry,
} from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useCallback, useRef } from 'react';
import columns from './columns'
import EditFrom from './components/CreateForm';

const RaspberryPiPackage = () => {
  const actionRef = useRef<ActionType>();
  const editRef = useRef<EditFrom>(null);

  const handleDelete = useCallback(
    async (record: API_RASPBERRY.GetListData) => {
      const { _id } = record;

      await deleteRaspberry({ _id })
        .then(() => {
          return actionRef.current?.reloadAndRest?.();
        })
        .catch(() => {
          message.info('删除错误');
        });
    },
    [],
  );

  const handleReBuild = useCallback(
    async (record: API_RASPBERRY.GetListData) => {
      const { _id } = record;

      return rebuildRaspberry({ _id })
        .then(() => {
          message.info('已开始进行构建');
        })
        .catch(() => {
          message.info('构建错误');
        });
    },
    [],
  );

  const handleEdit = useCallback((data: API_RASPBERRY.GetListData) => {
    editRef.current?.open(data);
  }, []);

  const handleAdd = useCallback(async () => {
    editRef.current?.open();
  }, []);

  const onEditConfirm = useCallback(
    async (value: API_RASPBERRY.PutDataParams) => {
      const { _id } = value;
      return (_id ? putRaspberry(value) : postRaspberry(value))
        .then(() => {
          actionRef.current?.reloadAndRest?.();
          return true;
        })
        .catch(() => {
          message.info('操作出错');
          return false;
        });
    },
    [],
  );

  return (
    <ProPage
      action={{
        remove: false,
      }}
      extraActionRender={(record) => {
        return (
          <>
            <Button
              style={{ padding: 0 }}
              key="edit"
              type="link"
              onClick={handleEdit.bind(null, record)}
            >
              修改
            </Button>
            <Button
              style={{ padding: 0 }}
              key="rebuild"
              type="link"
              onClick={handleReBuild.bind(null, record)}
            >
              重新构建
            </Button>
            <Popconfirm
              title="是否确定删除？"
              onConfirm={handleDelete.bind(null, record)}
            >
              <Button style={{ padding: 0 }} key="delete" type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      }}
      scroll={{ x: 'max-content' }}
      headerTitle="树莓派本地仓库管理"
      actionRef={actionRef}
      rowKey="_id"
      toolBarRender={() => {
        return [
          <Button key="add" type="primary" onClick={handleAdd}>
            新增
          </Button>,
        ];
      }}
      tableAlertRender={false}
      pagination={false}
      request={async () => {
        return getRaspberryList()
          .then((data) => {
            return { data: data.list, total: data.list.length };
          })
          .catch(() => ({ data: [], total: 0 }));
      }}
      columns={columns as any}
      rowSelection={false}
    >
      <EditFrom ref={editRef} onSubmit={onEditConfirm} />
    </ProPage>
  );
};

export default RaspberryPiPackage;
