import React, { memo, useMemo } from 'react'
import { Tooltip, Carousel, Image } from 'antd'
import { history } from 'umi'
import { ImageProps } from 'antd/es/image'
import { IMAGE_FALLBACK } from '@/utils'

export interface IImageProps {
  value: string[]
  imageProps?: Partial<ImageProps>
}

export default memo((props: IImageProps) => {

  const { value, imageProps={} } = useMemo(() => {
    return props
  }, [props])

  if(!value?.length) return (
    <div>[图片]</div>
  )

  return (
    <Tooltip
        title={
          <Carousel
            autoplay
            style={{width: 200, height: 150}}
          >
            {
              value.map((item: string) => {
                return (
                  <Image
                    key={item}
                    fallback={IMAGE_FALLBACK}
                    src={item}
                    width={200}
                    height={150}
                    {...imageProps}
                  />
                )
              })
            }
          </Carousel>
        }
      >
        [图片]<a onClick={(e) => {
          e.stopPropagation()
          history.push({
            pathname: '/media/detail/image',
            query: {
              url: value
            }
          })
        }} style={{textIndent: '1em', color: '#1890ff'}}>(预览)</a>
      </Tooltip>
  )

})