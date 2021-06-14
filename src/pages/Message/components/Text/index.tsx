import React, { memo } from "react"
import {
  ProFormTextArea,
} from '@ant-design/pro-form'

export default memo(({ rules }: any) => {

  return (
    <ProFormTextArea 
      name="text" 
      label="文本内容" 
      fieldProps={{
        autoSize: true
      }}
      rules={rules}
    />
  )

})