import { Form, Input } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import ProForm,{
  ModalForm,
} from '@ant-design/pro-form'
import type { Store } from 'antd/lib/form/interface'
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import SearchForm from '@/components/TransferSelect'
import { getMemberList } from '@/services'

type FormData = API_CHAT.IPostMemberParams

interface IProps {
  onCancel?: () => any
  onSubmit?: (data: FormData) => any
}

export interface IFormRef {
  open: (value: string) => void
}

const CreateForm = forwardRef<IFormRef, IProps>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ memberList, setMemberList ] = useState<{ key: string, title: string }[]>([])

  const { onCancel: propsCancel, onSubmit } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance | null>(null)

  const open = useCallback(async (value: string) => {
    setVisible(true)
    formRef.current?.setFieldsValue({
      room: value
    })
    const data = await getMemberList({
      room: value,
      currPage: 0,
      pageSize: 999999
    })
    setMemberList(data.list.map(item => ({
      key: item["_id"], 
      title: item.user?.username 
    })))
  }, [formRef])

  const onCancel = useCallback(() => {
    setVisible(false)
    formRef.current?.resetFields()
    propsCancel?.()
  }, [formRef])

  const onVisibleChange = useCallback((nowVisible: boolean) => {
    if(!nowVisible) onCancel()
    if(nowVisible !== visible) setVisible(nowVisible)
  }, [onCancel, visible])

  const onFinish = useCallback(async (values: Store) => {
    const { _id, ...nextValues } = values
    await (onSubmit && onSubmit(({
      ...nextValues,
      _id: _id.join(',')
    }) as FormData))
    setVisible(false)
    formRef.current?.resetFields()
  }, [onSubmit])

  useImperativeHandle(ref, () => ({
    open
  }))

  const fetchMemberList = useCallback(async () => {
    const params: API_CHAT.IGetMemberListParams = {
      currPage: 0,
      pageSize: 99999,
    } 
    try {
      const data = await getMemberList(params)
      return data.list.map(item => {
        const { _id } = item 
        const disabled = memberList?.some(member => member.key === _id)
        return { 
          key: _id, 
          title: item.user?.username,
          disabled
        }
      })
    }catch(er) {
      return []
    }
  }, [memberList])

  return (
    <ModalForm
      title="新增成员"
      visible={visible}
      // @ts-ignore
      formRef={formRef}
      onFinish={onFinish}
      onVisibleChange={onVisibleChange}
    >
      <ProForm.Group>
        <SearchForm
          wrapper={{  
            label: `新增成员`,
            name: "_id",
            rules:[
              {
                required: true,
                message: '请选择成员'
              }
            ]
          }}
          item={{
            fetchData: fetchMemberList
          }}
        />
      </ProForm.Group>
      <Form.Item
        name="room"
      >
        <Input type="hidden" />
      </Form.Item>
    </ModalForm>
  )

})

export default CreateForm
