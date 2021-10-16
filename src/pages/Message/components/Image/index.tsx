import React, { memo } from "react"
import Upload from '@/components/Upload'

export default memo(({ rules }: any) => {

  return (
    <Upload 
      wrapper={{
        label: '图片',
        name: 'image',
        rules
      }}
      item={{
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        allowMultiple: false
      }}
    />
  )

})