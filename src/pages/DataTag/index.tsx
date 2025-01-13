import { ProPage } from '@/components/ProTable';
import { message } from '@/components/Toast';
import { deleteMovieTag, getMovieTagList, putMovieTag } from '@/services';
import type { ActionType } from '@ant-design/pro-components';
import { Button } from 'antd';
import { identity, pickBy } from 'lodash';
import { memo, useCallback, useRef } from 'react';
import { connect } from 'umi';
import columns from './columns';
import { mapDispatchToProps, mapStateToProps } from './connect';

const TagManage = memo(() => {
  const actionRef = useRef<ActionType>();

  /**
   * 修改节点
   * @param fields
   */
  const handleAdd = useCallback(
    async (record: API_DATA.IGetMovieTagResData) => {
      const hide = message.loading('正在修改');

      try {
        await putMovieTag({ _id: record['_id'], valid: !record.valid });
        hide();
        message.success('操作成功');
        return true;
      } catch (error) {
        hide();
        message.error('操作失败请重试！');
        return false;
      }
    },
    [],
  );

  /**
   *  删除节点
   * @param selectedRows
   */

  const handleRemove = useCallback(
    async (selectedRows: API_DATA.IGetMovieTagResData[]) => {
      try {
        await deleteMovieTag({
          _id: selectedRows.map(item => item._id).join(','),
        });
      } catch (err) {
        return false;
      }
      actionRef.current?.reloadAndRest?.();
      return true;
    },
    [],
  );

  const fetchData = useCallback(async (params: any) => {
    const { current, valid, ...nextParams } = params;
    let newParams = {
      ...nextParams,
      currPage: current - 1,
    };
    if (valid !== undefined) {
      if (valid === 'true') {
        newParams.valid = true;
      } else {
        newParams.valid = false;
      }
    }
    newParams = pickBy(newParams, identity);
    return getMovieTagList(newParams)
      .then(({ list, total }) => ({ data: list, total }))
      .catch(() => ({ data: [], total: 0 }));
  }, []);

  return (
    <ProPage
      action={{
        remove: {
          action: handleRemove,
        },
      }}
      extraActionRender={(record) => {
        return (
          <Button
            type="link"
            style={{
              paddingLeft: 0,
            }}
            danger={record.valid}
            onClick={() => handleAdd(record)}
          >
            {record.valid ? '禁用' : '启用'}
          </Button>
        );
      }}
      headerTitle="数据标签列表"
      actionRef={actionRef}
      scroll={{ x: 'max-content' }}
      pagination={{ defaultPageSize: 10 }}
      rowKey="_id"
      request={fetchData}
      columns={columns}
      rowSelection={{}}
    />
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(TagManage);
