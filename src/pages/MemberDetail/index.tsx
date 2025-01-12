import { message } from '@/components/Toast';
import { deleteUser, getUserDetail, putUser } from '@/services';
import { ProCard } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { parse } from 'querystring'
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { history } from 'umi';
import PageContainer from '@/components/PageContainer'
import Form from '../Member/components/CreateForm';
import Descriptions from './components/Descriptions';
import Table from './components/Table';
import { ACTIVE_KEY_MAP } from './constants';

export default memo(() => {
  const [detail, setDetail] = useState<API_USER.IGetUserDetailRes>();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeKey, setActiveKey] =
    useState<keyof typeof ACTIVE_KEY_MAP>('upload');

  const modalRef = useRef<Form>(null);

  const fetchData = useCallback(async (userId: string) => {
    setLoading(true);
    const data = await getUserDetail({ _id: userId });
    unstable_batchedUpdates(() => {
      setDetail(data);
      setLoading(false);
    });
  }, []);

  const deleteUsers = useCallback(async () => {
    return new Promise((resolve) => {
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        title: '提示',
        content: '确定删除该用户吗?',
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
      .then((res) => {
        const id = detail?._id;
        if (res && id) {
          return deleteUser({ _id: id });
        }
        return Promise.reject();
      })
      .then(() => {
        message.info('操作成功');
      })
      .catch(() => {});
  }, [loading, detail]);

  const edit = useCallback(() => {
    modalRef.current?.open(detail?._id);
  }, [detail]);

  const editUser = useCallback(
    async (params: any) => {
      const newValue = {
        ...detail,
        ...params,
      } as API_USER.IPutUserParams;
      await putUser(newValue);
      message.info('操作成功');
      return await fetchData(newValue._id);
    },
    [loading, detail, fetchData],
  );

  const onTabChange = useCallback((activeKey: string) => {
    setActiveKey(activeKey as any);
  }, []);

  useEffect(() => {
    const {
      location: { pathname, search },
    } = history;
    const [specialId] = pathname.split('/').slice(-1) || [];
    const { activeKey } = parse(search) as { activeKey: string };
    if (activeKey) setActiveKey(activeKey as keyof typeof ACTIVE_KEY_MAP);
    fetchData(specialId);
  }, []);

  return (
    <PageContainer
      header={{
        title: detail?.username || '用户详情',
        ghost: true,
        extra: [
          <Button onClick={edit} key="1" type="primary">
            编辑
          </Button>,
          <Button onClick={deleteUsers} key="2" danger>
            删除
          </Button>,
        ],
      }}
      tabList={[
        {
          tab: '上传记录',
          key: 'upload',
          closable: false,
        },
        {
          tab: '评论记录',
          key: 'comment',
          closable: false,
        },
        {
          tab: '评分记录',
          key: 'rate',
          closable: false,
        },
        {
          tab: '反馈记录',
          key: 'feedback',
          closable: false,
        },
        {
          tab: '粉丝信息',
          key: 'fans',
          closable: false,
        },
        {
          tab: '关注信息',
          key: 'attentions',
          closable: false,
        },
      ]}
      tabProps={{
        onChange: onTabChange,
        activeKey,
      }}
      content={
        <Descriptions loading={loading} onChange={editUser} value={detail} />
      }
    >
      <ProCard loading={loading}>
        <Table value={detail?._id} activeKey={activeKey} />
      </ProCard>
      <Form onSubmit={editUser} ref={modalRef} />
    </PageContainer>
  );
});
