import { history } from 'umi'
import React from 'react'
import { Space, message, Dropdown, Menu } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { pick } from 'lodash'
import issueColumns from './components/Table/issue-columns'
import commentColumns from './components/Table/comment-columns'
import rateColumns from './components/Table/rate-columns'
import feedbackColumns from './components/Table/feedback-columns'
import userColumns from './components/Table/user-columns'
import { IFeedbackModalRef, TFeedbackEditData } from '../Feedback/components/FeedbackModal'
import MemberEdit from '../Member/components/CreateForm'
import { 
  getUserCommentList, 
  getUserFeedbackList, 
  getUserRateList, 
  getUserIssueList,
  deleteUserComment,
  deleteUserFeedback,
  putUserFeedback,
  deleteMovie,
  getUserAttentionsList,
  getUserFansList,
  deleteUser,
  putUser
} from '@/services'

export const ACTIVE_KEY_MAP = {
  upload: {
    fetchData: getUserIssueList,
    detail: (record: API_USER.IGetUserIssueData, instance: any) => history.push(`/data/main/${record._id}`),
    columns: issueColumns,
    deleteOp: deleteMovie,
    editOp: {},
    op: (record: API_USER.IGetUserIssueData, _: any, deleteOp: any) => {
      return (
        <Space>
          <a
            onClick={() => {
              history.push({
                pathname: '/data/main/edit',
                query: {
                  id: record._id
                }
              })
            }}
          >
            编辑
          </a>
          <a
            style={{color: 'red'}}
            onClick={deleteOp.bind(this, record._id)}
          >
            删除
          </a>
          <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <a style={{color: '#1890ff'}} onClick={() => {
                  history.push(`/data/main/${record._id}`)
                }}>
                详情
                </a>
              </Menu.Item>
            </Menu>
          }>
            <a onClick={e => e.preventDefault()}>
              <EllipsisOutlined />
            </a>
          </Dropdown>
        </Space>
      )
    }
  },
  comment: {
    fetchData: getUserCommentList,
    detail: (record: API_USER.ICommentData, instance: any) => {
      return instance.current?.open(record._id)
    },
    deleteOp: deleteUserComment,
    columns: commentColumns,
    editOp: {},
    op: (record: API_USER.ICommentData, _: any, deleteOp: any) => {
      return (
        <Space>
          <a
            style={{color: 'red'}}
            onClick={deleteOp.bind(this, record._id)}
          >
            删除
          </a>
        </Space>
      )
    }
  },
  rate: {
    fetchData: getUserRateList,
    detail: (record: API_USER.IGetUserIssueData) => history.push(`/data/main/${record._id}`),
    columns: rateColumns,
    deleteOp: () => Promise.resolve(),
    editOp: {},
    op: () => {
      return (
        '-'
      )
    }
  },
  feedback: {
    fetchData: getUserFeedbackList,
    deleteOp: deleteUserFeedback,
    detail: (record: API_USER.IGetFeedbackData, instance: any) => {
      return instance.current?.open(record._id)
    },
    columns: feedbackColumns,
    editOp: {
      onOk: async (reload: any, data: TFeedbackEditData) => {
        const hide = message.loading('正在修改')
        const params = pick(data, ['_id', 'status', 'description']) as API_USER.IPutFeedbackParams
        return putUserFeedback(params)
        .then(_ => {
          message.success('操作成功')
        })
        .catch(_ => {
          message.success('操作失败，请重试')
        })
        .then(_ => {
          hide()
          return reload()
        })
        .then(_ => true)
      }
    },
    op: (record: API_USER.IGetFeedbackData, ref: React.RefObject<IFeedbackModalRef>, deleteOp: any) => {
      return (
        <Space>
          {
            record.status === 'DEALING' && (
              <a
                onClick={() => {
                  ref.current?.open(record)
                }}
              >
                处理
              </a>
            )
          }
          <a
            style={{color: 'red'}}
            onClick={deleteOp.bind(this, record._id)}
          >
            删除
          </a>
        </Space>
      )
    } 
  },
  fans: {
    fetchData: getUserFansList,
    detail: (record: API_USER.IGetUserDetailRes, instance: any) => history.push(`/member/main/${record._id}`),
    columns: userColumns,
    deleteOp: deleteUser,
    editOp: {
      onOk: async (reload: any, data: unknown) => {
        const hide = message.loading('正在修改')
        const { avatar, role, ...nextFields } = data as API_USER.IPutUserParams

        const params = {
          ...nextFields,
          avatar: Array.isArray(avatar) ? avatar[0] : avatar,
          role: (Array.isArray(role) ? role : [role]).join(',')
        }
        return putUser(params)
        .then(_ => {
          message.success('操作成功')
        })
        .catch(err => {
          message.success('操作失败，请重试')
        })
        .then(_ => {
          hide()
          return reload()
        })
        .then(_ => true)
      }
    },
    op: (record: API_USER.IGetUserDetailRes, ref: React.RefObject<MemberEdit>, deleteOp: any) => {
      return (
        <Space>
          <a
            onClick={() => {
              ref.current?.open(record._id)
            }}
          >
            编辑
          </a>
          <a
            style={{color: 'red'}}
            onClick={deleteOp.bind(this, record._id)}
          >
            删除
          </a>
          <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <a style={{color: '#1890ff'}} onClick={() => {
                  history.push(`/member/${record._id}`)
                }}>
                详情
                </a>
              </Menu.Item>
            </Menu>
          }>
            <a onClick={e => e.preventDefault()}>
              <EllipsisOutlined />
            </a>
          </Dropdown>
        </Space>
      )
    }
  },
  attentions: {
    fetchData: getUserAttentionsList,
    detail: (record: API_USER.IGetUserDetailRes, instance: any) => history.push(`/member/main/${record._id}`),
    columns: userColumns,
    deleteOp: deleteUser,
    editOp: {
      onOk: async (reload: any, data: unknown) => {
        const hide = message.loading('正在修改')
        const { avatar, role, ...nextFields } = data as API_USER.IPutUserParams

        const params = {
          ...nextFields,
          avatar: Array.isArray(avatar) ? avatar[0] : avatar,
          role: (Array.isArray(role) ? role : [role]).join(',')
        }
        return putUser(params)
        .then(_ => {
          message.success('操作成功')
        })
        .catch(err => {
          message.success('操作失败，请重试')
        })
        .then(_ => {
          hide()
          return reload()
        })
        .then(_ => true)
      }
    },
    op: (record: API_USER.IGetUserDetailRes, ref: React.RefObject<MemberEdit>, deleteOp: any) => {
      return (
        <Space>
          <a
            onClick={() => {
              ref.current?.open(record._id)
            }}
          >
            编辑
          </a>
          <a
            style={{color: 'red'}}
            onClick={deleteOp.bind(this, record._id)}
          >
            删除
          </a>
          <Dropdown overlay={
            <Menu>
              <Menu.Item>
                <a style={{color: '#1890ff'}} onClick={() => {
                  history.push(`/member/${record._id}`)
                }}>
                详情
                </a>
              </Menu.Item>
            </Menu>
          }>
            <a onClick={e => e.preventDefault()}>
              <EllipsisOutlined />
            </a>
          </Dropdown>
        </Space>
      )
    }
  }
}