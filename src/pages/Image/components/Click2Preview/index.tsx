import { history } from 'umi'

export default function preview(images: string | string[]) {
  if(!images) return 
  const list = Array.isArray(images) ? images : [images]
  history.push({
    pathname: '/media/image',
    query: {
      url: list,
    },
  })
}

