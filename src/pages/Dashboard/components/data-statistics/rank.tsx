import React from 'react'
import styles from './index.less'
import numeral from 'numeral'

export interface IRankData {
  index?: number
  title: string
  value: number | React.ReactNode
}

const Rank: React.FC<any> = ({
  title,
  data=[]
}: {
  title: string | React.ReactNode,
  data: Array<IRankData>
}) => {

  return (
    <div className={styles.salesRank}>
      <h4 className={styles.rankingTitle}>
        {title}
      </h4>
      <ul className={styles.rankingList}>
        {data.map((item: IRankData, i: number) => {
          const { title, value, index=i+1 } = item
          return (
            <li key={title}>
              <span className={`${styles.rankingItemNumber} ${index < 3 ? styles.active : ''}`}>
                {index}
              </span>
              <span className={styles.rankingItemTitle} title={title}>
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