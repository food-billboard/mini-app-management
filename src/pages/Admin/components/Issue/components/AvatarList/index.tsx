import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { history } from 'umi'
import { merge } from 'lodash'
import AvatarList from '../../../AvatarList'
import { getStoreUserList } from '@/services'

interface IProps {
  id: string 
}

export default memo((props: IProps) => {

  const { id } = useMemo(() => {
    return props 
  }, [props])

  const [ list, setList ] = useState<API_DATA.IGetMovieStoreUserListData[]>([])

  const fetchData = useCallback(async (params: API_DATA.IGetMovieStoreUserListParams={}) => {
    const data = await getStoreUserList(merge({}, params, { currPage: 0, pageSize: 10, _id: id }))
    setList(data.list || [])
  }, [id])

  const getUserDetail = useCallback((id: string, e) => {
    e.stopPropagation()
    return history.push(`member/${id}`)
  }, [])

  useEffect(() => {
    if(id) fetchData()
  }, [id])

  return (
    <AvatarList 
      size="small"
      maxLength={10}
    >
      {
        list.map(item => (
          <AvatarList.Item
            key={`${item._id}-avatar-${item._id}`}
            src={item.avatar}
            tips={item.username}
            size={"small"}
            onClick={getUserDetail.bind(this, item._id)}
          />
        ))
      }
    </AvatarList>
  )

})