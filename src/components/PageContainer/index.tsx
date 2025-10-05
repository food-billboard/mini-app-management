import { PageContainer as AntPageContainer } from '@ant-design/pro-components'
import type { PageContainerProps as AntPageContainerProps } from '@ant-design/pro-components'

export type PageContainerProps = AntPageContainerProps

const PageContainer = (props: PageContainerProps) => {

  return (
    <AntPageContainer
      token={{
        paddingBlockPageContainerContent: 0,
        paddingInlinePageContainerContent: 20,
      }}
      {...props}
      style={{
        height: '100%',
        overflowY: 'auto',
        ...props.style
      }}
    />
  )

}

export default PageContainer