import React from 'react'
import { getFlatMenus } from '@umijs/route-utils'

const AUTHORITY_FETCH_MAPPING = {
  'home': '',
  'member': '',
  'data': '',
  'admin': '',
  'error': ''
}

const Authority: React.FC<any> = (props) => {

  const { children, location } = props
  const { pathname } = location

  return children

}

export default Authority