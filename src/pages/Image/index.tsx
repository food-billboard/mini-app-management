import { isObjectId } from '@/components/Upload/util';
import { getMediaList } from '@/services';
import { formatUrl } from '@/utils';
import { Button, Image, Result } from 'antd';
import { PureComponent } from 'react';
import { history } from 'umi';
import { parse } from 'querystring'
import styles from './index.less';

export type TSrc = {
  src: string;
  [key: string]: any;
};

interface IState {
  values: TSrc[];
}

class ImagePreview extends PureComponent<any> {
  public state: IState = {
    values: [],
  };

  public componentDidMount = async () => {
    const urls = this.getUrl();
    this.setState({
      values: urls,
    });
  };

  public fetchData = async (urls: TSrc[]) => {
    const newValues = await Promise.allSettled(
      urls.map((item) => {
        const { src } = item;
        if (typeof src === 'string' && !isObjectId(src)) {
          return {
            src: formatUrl(src),
          };
        }
        return getMediaList({
          type: 0,
          _id: src,
        }).then((data) => {
          return {
            src: formatUrl(data.list[0].src),
          };
        });
      }),
    );
    this.setState({
      values: newValues,
    });
    return newValues;
  };

  public getUrl = () => {
    const {
      location: { search },
    } = history;
    const { url: videoUrl = [] } =
      (parse(search) as { url: string[] | undefined }) || {};
    return (Array.isArray(videoUrl) ? videoUrl : [videoUrl])?.map((url) => {
      try {
        const { pathname } = new URL(url);
        return {
          src: `/api${pathname}`,
        };
      } catch (err) {
        return {
          src: url,
        };
      }
    });
  };

  public goback = () => {
    history.go(-1);
  };

  render() {
    const { values } = this.state;

    if (!values || !values.length)
      return (
        <Result
          status="404"
          title="404"
          subTitle="对不起，当前无图片资源"
          extra={
            <Button onClick={this.goback} type="primary">
              回到上一页
            </Button>
          }
        />
      );

    return (
      <div className={styles['image-viewer-wrapper']}>
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          {values.map((item) => {
            return <Image width={200} src={item.src} />;
          })}
        </Image.PreviewGroup>
      </div>
    );
  }
}

export default ImagePreview;
