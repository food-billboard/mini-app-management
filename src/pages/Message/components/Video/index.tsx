import React, { memo } from "react"
import VideoUpload from '@/components/VideoUpload'

export default memo(({ rules }: any) => {

  return (
    <VideoUpload 
      wrapper={{
        label: '视频',
        name: 'video',
        rules
      }}
      item={{
        maxFiles: 1,
        acceptedFileTypes: ['video/*'],
        allowMultiple: false
      }}
    />
  )

})