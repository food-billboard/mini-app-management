import React, {Component  } from 'react'
import { history, Link } from 'umi'

interface IProps {

}

interface IState {

}

export default class extends Component<IProps, IState> {

  public render = () => {

    return (
      <Link to="/home">
              忘记密码
            </Link>
    )

  }

}