import { useModel } from '@umijs/max'
import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { getUserInfo } from '@/services'

function useUserInfo() {
  const { initialState, setInitialState } = useModel('@@initialState')

  useEffect(() => {
    getUserInfo()
    .then(data => {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: data ,
        }));
      });
    })
  }, [])
}

export default useUserInfo