import React, {Component  } from 'react'
import { history } from 'umi'

interface IProps {

}

interface IState {

}

export default class extends Component<IProps, IState> {

  public render = () => {

    return (
      <div 
        onClick={() => {
          history.push({
            pathname: '/data/video',
            query: {
              url: 'http://localhost:4000/static/video/273dbc82f45552ff7b98d36bf1ad86a8.mp4'
            }
          })
        }}
        style={{cursor: 'pointer', color: '#1890ff'}}
      >1111</div>
    )

  }

}