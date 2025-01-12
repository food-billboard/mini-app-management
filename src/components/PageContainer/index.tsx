import { PageContainer as AntPageContainer } from '@ant-design/pro-components'
import type { PageContainerProps as AntPageContainerProps } from '@ant-design/pro-components'

export type PageContainerProps = AntPageContainerProps

const PageContainer = (props: PageContainerProps) => {

  return (
    <AntPageContainer
      token={{
        paddingBlockPageContainerContent: 24,
        paddingInlinePageContainerContent: 60,
      }}
      {...props}
    />
  )

}

export default PageContainer