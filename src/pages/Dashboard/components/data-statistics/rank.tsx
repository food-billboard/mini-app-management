import React, { useCallback } from 'react'
import { history } from 'umi'
import styles from './index.less'
import numeral from 'numeral'

export interface IRankData {
  index?: number
  title: string
  value: number | React.ReactNode
  _id: string 
}

const Rank: React.FC<any> = ({
  title,
  data=[]
}: {
  title: string | React.ReactNode,
  data: Array<IRankData>
}) => {

  const getUserDetail = useCallback((id: string) => {
    if(id) {
      history.push(`/member/${id}`)
    }
  }, [])

  return (
    <div className={styles.salesRank}>
      <h4 className={styles.rankingTitle}>
        {title}
      </h4>
      <ul className={styles.rankingList}>
        {data.map((item: IRankData, i: number) => {
          const { title, value, index=i+1 } = item
          return (
            <li key={title+index}>
              <span className={`${styles.rankingItemNumber} ${index < 3 ? styles.active : ''}`}>
                {index}
              </span>
              <span onClick={getUserDetail.bind(this, item._id)} className={styles.rankingItemTitle} title={title}>
                {title}
              </span>
              <span className={styles.rankingItemValue}>
                {numeral(value).format('0,0')}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )

}

export default Rank