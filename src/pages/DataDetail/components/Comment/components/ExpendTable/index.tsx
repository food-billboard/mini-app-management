import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { message, Space, Popconfirm, Button } from 'antd';
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import AddModal from '../AddModal';
import type { IFormRef } from '../AddModal';
import columns from '../../columns'
import { deleteMovieCommentList, postMovieCommentList, getMovieCommentDetail, getMovieCommentList } from '@/services'
import { withTry } from '@/utils'

export const deleteComment = async (fetchData: any, id: string) => {
  const [err] = await withTry(deleteMovieCommentList)({
    _id: id,
  });
  if (err) {
    message.info('删除评论出错');
  }
  await fetchData({});
}

export const newColumns = (fetchData: any) => [
  ...columns,
  {
    dataIndex: 'op',
    title: '操作',
    key: 'op',
    fixed: 'right',
    render: (_: any, record: API_DATA.IGetMovieCommentData) => {
      return (
        <Space>
          <Popconfirm
            title="是否确定删除？"
            onConfirm={deleteComment.bind(null, fetchData, record['_id'])}
            okText="确定"
            cancelText="取消"
          >
            <Button danger type="link" key="delete">
              删除
            </Button>
          </Popconfirm>
        </Space>
      );
    },
  }
]

const ExpendTable = (props: {
  _id: string 
  source_type: API_USER.TSourceType
  currentExpend: string 
}) => {

  const [ commentData, setCommentData ] = useState<API_DATA.IGetMovieCommentDetailData[]>([])
  const [ currPage, setCurrPage ] = useState<number>(1)
  const [ total, setTotal ] = useState<number>(0)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ currentExpend, setCurrentExpend ] = useState<string>("")

  const addRef = useRef<IFormRef>(null);

  const { _id, source_type, currentExpend: propsCurrentExpend } = props 

  const onPageChange = useCallback((page) => {
    setCurrPage(page)
    fetchData({ currPage: page })
  }, [])

  const fetchData = useCallback(async (params: Partial<API_DATA.IGetMovieCommentParams>={}) => {
    setLoading(true)
    const method = source_type === "movie" ? getMovieCommentList : getMovieCommentDetail
    const data = await method({
      ...params,
      currPage: (params.currPage ?? currPage) - 1,
      _id,
      pageSize: 10,
    })
    setTotal(data.total || 0)
    setCommentData(data.list || [])
    setLoading(false)
  }, [_id, currPage])

  const columns = useMemo(() => {
    return newColumns(fetchData)
  }, [fetchData]);

  const postComment = useCallback(
    async (values: Omit<API_DATA.IPostMovieCommentParams, 'source_type'>) => {
      const [err] = await withTry(postMovieCommentList)({
        ...values,
        source_type,
      });
      if (err) {
        message.info('新增评论出错');
      } else {
        onPageChange(1);
      }
    },
    [source_type],
  );

  const expandedRowRender = useCallback((record: API_DATA.IGetMovieCommentDetailData) => {
    const { _id } = record 
    return (
      <ExpendTable
        source_type={"comment"}
        _id={_id}
        currentExpend={currentExpend}
      />
    )
  }, [currentExpend])

  const init = useCallback(async (value) => {
    setCurrPage(1);
    await fetchData(value);
  }, [fetchData]);

  const openAddModal = useCallback((id: string) => {
    addRef.current?.open(id);
  }, []);

  const title = useMemo(() => {
    return function render() {
      return (
        <Space>
          <LightFilter collapse onFinish={init}>
            <ProFormDatePicker
              name="start_date"
              label="起始时间"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
            />
            <ProFormDatePicker
              name="end_date"
              label="结束时间"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
            />
          </LightFilter>
          <Button key="add" type="primary" onClick={openAddModal.bind(null, _id!)}>
            新增
          </Button>
        </Space>
      );
    };
  }, [openAddModal, init, _id]);

  const onExpand = useCallback((expanded: boolean, record: API_DATA.IGetMovieCommentDetailData) => {
    if(expanded) setCurrentExpend(record._id)
  }, [])

  useEffect(() => {
    if(_id === propsCurrentExpend) fetchData({})
  }, [propsCurrentExpend, _id])

  return (
    <>
      <ProTable
        title={title}
        columns={columns as any}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={commentData}
        loading={loading}
        bordered
        rowKey={(record) => record['_id']}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: currPage,
          total,
          onChange: onPageChange
        }}
        expandable={{
          expandedRowRender,
          onExpand,
        }}
      />
       <AddModal ref={addRef} onSubmit={postComment} />
    </>
  );
}

export default ExpendTable 