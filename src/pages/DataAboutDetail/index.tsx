import { message } from '@/components/Toast';
import { Button, Modal, Result } from 'antd';
import type { FC } from 'react';
import { Fragment, memo, useCallback, useMemo, useRef, useState } from 'react';
import { history } from 'umi';
import type { IEditRef } from './component/Edit';
import { Edit } from './component/Edit';
import type {
  TAddActionType,
  TDeleteActionType,
  TEditActionType,
  TPath,
} from './component/Item';
import { AboutInfo } from './component/Item';
import type { DataAboutRef } from './component/List';
import { DataAbout } from './component/List';

const CardList: FC<any> = () => {
  const [path]: [TPath] = useMemo(() => {
    const {
      location: { pathname },
    } = history;
    return pathname.split('/').slice(-1) as [TPath];
  }, []);

  const [formState, setFormState] = useState<'add' | 'edit'>('add');

  const editRef = useRef<IEditRef>(null);

  const listRef = useRef<DataAboutRef>(null);

  const goBack = useCallback(() => {
    history.go(-1);
  }, []);

  const addItem: TAddActionType = useCallback(() => {
    editRef.current?.open();
    setFormState('add');
  }, []);

  const deleteItem: TDeleteActionType = useCallback(
    (id: string) => {
      Modal.confirm({
        cancelText: '取消',
        okText: '确定',
        title: '提示',
        content: '是否确定删除',
        onOk() {
          return AboutInfo[path]
            .delete({
              _id: id,
            })
            .then(() => {
              message.info('删除成功');
              return listRef.current?.fetchData();
            });
        },
      });
    },
    [listRef, path],
  );

  const editItem: TEditActionType = useCallback((id: string) => {
    editRef.current?.open({
      id,
    });
    setFormState('edit');
  }, []);

  const confirm = useCallback(
    async (values: any) => {
      try {
        await AboutInfo[path][formState](values);
        await listRef.current?.fetchData();
        return Promise.resolve();
      } catch (err) {
        message.error('操作失败，请重试');
        return Promise.reject();
      }
    },
    [formState, path],
  );

  if (!Object.keys(AboutInfo).some((key) => key === path))
    return (
      <Result
        status="404"
        title="404"
        subTitle="没有找到对应的页面"
        extra={
          <Button type="primary" onClick={goBack}>
            返回
          </Button>
        }
      />
    );

  return (
    <Fragment>
      <DataAbout
        ref={listRef}
        fetchData={AboutInfo[path].fetchData}
        headerExtra={null}
        renderItem={AboutInfo[path].renderItem({
          addItem,
          deleteItem,
          editItem,
        })}
      />
      <Edit
        ref={editRef}
        renderForm={AboutInfo[path].renderForm}
        fetchData={AboutInfo[path].fetchData}
        onConfirm={confirm}
      />
    </Fragment>
  );
};

export default memo(CardList);
