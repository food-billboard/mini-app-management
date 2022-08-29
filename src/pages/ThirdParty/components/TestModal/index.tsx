import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react'
import { Modal, Button } from 'antd'
import { getThirdData } from '@/services'
import CodeEditor from '@/components/CodeEditor'
import { CodeData } from '@/components/JsonViewer'

export type TestModalRef = {
  open: (value: API_THIRD.GetThirdListData) => void 
}

const TestModal = forwardRef<TestModalRef>((props, ref) => {

  const [ result, setResult ] = useState<any>()
  const [ visible, setVisible ] = useState<boolean>(false)
  const [ params, setParams ] = useState<string>('')
  const [ thirdData, setThirdData ] = useState<API_THIRD.GetThirdListData>()
  const [ fetchLoading, setFetchLoading ] = useState<boolean>(false)

  const open = (value: API_THIRD.GetThirdListData) => {
    setThirdData(value)
    setVisible(true)
  }

  const handleFetchData = useCallback(async () => {
    setFetchLoading(true)
    return getThirdData({
      params,
      _id: thirdData!._id
    })
    .then((data: any) => {
      setResult(data)
    })
    .catch(() => {
      
    })
    .then(() => {
      setFetchLoading(false)
    })
  }, [params, thirdData])

  const handleCancel = useCallback(() => {
    setResult('')
    setVisible(false)
    setFetchLoading(false)
    setParams('')
  }, [])

  const handleOk = useCallback(() => {
    handleCancel()
  }, [handleCancel])

  useImperativeHandle(ref, () => {

    return {
      open
    }

  }, [])


  return (
    <Modal
      title='第三方接口测试'
      onOk={handleOk}
      onCancel={handleCancel}
      visible={visible}
    >
      {
        thirdData?.params && (
          <CodeEditor 
            value={params}
            onChange={setParams}
            language="json"
            height={100}
          />
        )
      }
      <Button style={{marginTop: 20}} type='primary' onClick={handleFetchData} loading={fetchLoading}>
        测试
      </Button>
      {
        !!result && (
          <CodeData 
            value={result}
          />
        )
      }
    </Modal>
  )

})

export default TestModal