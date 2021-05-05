import { history } from 'umi'

export default function(images: string | string[], event: any) {
  if(!images) return 
  let list = Array.isArray(images) ? images : [images]
  return history.push({
    pathname: '/media/image',
    query: {
      url: list,
    },
  })
}

