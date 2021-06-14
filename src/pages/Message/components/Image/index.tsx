import React, { memo } from "react"
import Upload from '@/components/Upload'

export default memo(({ rules }: any) => {

  return (
    <Upload 
      wrapper={{
        label: '海报',
        name: 'image',
        rules: rules
      }}
      item={{
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        allowMultiple: false
      }}
    />
  )

})