import { preview } from '@/components/VideoPreview';
import { GerAdminCommentList } from '@/services';
import { IMAGE_FALLBACK } from '@/utils';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Col, Image, List, Pagination, Row } from 'antd';
import dayjs from 'dayjs';
import { merge, noop } from 'lodash';
import { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import styles from './index.less';

const ICON_MAP = {
  star: StarOutlined,
  like: LikeOutlined,
  message: MessageOutlined,
};

const Comments = memo(() => {
  const { initialState } = useModel('@@initialState');
  const { currentUser: userInfo } = initialState || {};

  const [list, setList] = useState<API_ADMIN.IGetAdminCommentData[]>([]);
  const [currPage, setCurrPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const IconText = ({
    type,
    text,
  }: {
    type: keyof typeof ICON_MAP;
    text: string;
  }) => {
    const Component = ICON_MAP[type];

    return (
      <span>
        <Component
          style={{
            marginRight: 8,
          }}
        />
        {text}
      </span>
    );
  };

  const fetchData = useCallback(
    async (params: API_ADMIN.IGetAdminCommentListParams = {}) => {
      const data = await GerAdminCommentList(
        merge({}, params, {
          currPage: currPage - 1,
          pageSize: 10,
        }) as API_ADMIN.IGetAdminCommentListParams,
      );
      unstable_batchedUpdates(() => {
        setTotal(data.total || 0);
        setList(data.list || []);
      });
    },
    [currPage],
  );

  const renderMedia = useCallback(
    (content: API_ADMIN.IGetAdminCommentData['content']) => {
      const { image = [], video = [] } = content || {};
      const result = [...image.map((item) => ({ src: item, video: false }))];
      result.push(...video.map((item) => ({ src: item, video: true })));
      return result.map((item, index) => {
        const { video: isVideo, src } = item;
        const method = isVideo ? preview.bind(null, video) : noop;
        return (
          <Col key={index} span={8} onClick={() => method()}>
            <Image
              fallback={IMAGE_FALLBACK}
              src={isVideo ? '' : src}
              preview={!isVideo}
              className={styles['media-image-list-item']}
            />
          </Col>
        );
      });
    },
    [],
  );

  const onPageChange = useCallback((page: number) => {
    setCurrPage(page);
  }, []);

  useEffect(() => {
    fetchData();
  }, [currPage]);

  return (
    <Fragment>
      <List
        size="large"
        className={styles.articleList}
        rowKey={'id' as any}
        itemLayout="vertical"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            key={item['_id']}
            actions={[
              // <IconText key="star" type="star" text={item.total_like} />,
              <IconText
                key="like"
                type="like"
                text={item.total_like.toString()}
              />,
              <IconText
                key="message"
                type="message"
                text={item.sub_comments.toString()}
              />,
            ]}
          >
            <List.Item.Meta
              title={
                <div className={styles.listItemMetaTitle}>
                  <Avatar src={userInfo?.avatar} style={{ marginRight: 20 }}>
                    {userInfo?.username}
                  </Avatar>
                  {userInfo?.username}
                </div>
              }
              description={
                <span>
                  {item.content?.text}
                  <Row gutter={24}>{renderMedia(item.content)}</Row>
                </span>
              }
            />
            <em>{dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}</em>
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'right' }}>
        <Pagination
          pageSize={10}
          current={currPage}
          total={total}
          onChange={onPageChange}
          hideOnSinglePage
        />
      </div>
    </Fragment>
  );
});

export default Comments;
