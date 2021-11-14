import React, { memo } from 'react'
import { Tooltip, Carousel, Image } from 'antd'
import { history } from 'umi'
import type { ImageProps } from 'antd/es/image'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

export interface IImageProps {
  value: string[]
  imageProps?: Partial<ImageProps>
}

export default memo((props: IImageProps) => {

  const { value, imageProps={} } = props

  if(!value?.length) return (
    <div>[图片]</div>
  )

  return (
    <Tooltip
      className={styles["image-carousel"]}
      title={
        <Carousel
          autoplay
          className={styles["image-carousel"]}
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
          pathname: '/media/image',
          query: {
            url: value
          }
        })
      }} style={{textIndent: '1em', color: '#1890ff'}}>(预览)</a>
    </Tooltip>
  )

})