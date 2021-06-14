import React, { memo } from "react"
import Upload from '@/components/Upload'

export default memo(({ rules }:any) => {

  return (
    <Upload 
      wrapper={{
        label: '视频',
        name: 'video',
        rules: rules
      }}
      item={{
        maxFiles: 1,
        acceptedFileTypes: ['video/*'],
        allowMultiple: false
      }}
    />
  )

})