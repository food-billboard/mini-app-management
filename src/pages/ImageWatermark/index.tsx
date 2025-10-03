import { message, modal } from '@/components/Toast';
import { UploadOutlined } from '@ant-design/icons';
import { useDebounceEffect, useGetState, useUpdate } from 'ahooks';
import type { UploadFile } from 'antd';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Row,
  Spin,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import exifr from 'exifr';
import { saveAs } from 'file-saver';
import heic2any from 'heic2any';
import JSZip from 'jszip';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';

const { TextArea } = Input;

async function reverseGeocoding(lng: string, lat: string) {
  const url = `https://restapi.amap.com/v3/geocode/regeo?key=${process.env.AMP_KEY}&location=${lng},${lat}&output=JSON&extensions=all`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1') {
      return data.regeocode;
    } else {
      throw new Error(data.info);
    }
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

function generateWatermark(
  fileObj: any,
  type: string,
  time: string,
  text: string,
) {
  const canvas = document.createElement('canvas');
  canvas.style.background = 'transparent';
  const image = new Image();
  let url = '';
  return new Promise((resolve) => {
    image.onload = function () {
      const width = image.width;
      const height = image.height;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');

      context?.drawImage(image, 0, 0, width, height);

      const maxFontSizePercent = 10;

      const fontSize = Math.min(
        width * (maxFontSizePercent / 100),
        height * (maxFontSizePercent / 100),
      );

      // 设置文字属性
      context!.font = `italic bold ${fontSize}px Arial, sans-serif`; // 字体样式
      context!.fillStyle = 'rgba(255, 255, 255, 1)'; // 填充颜色
      context!.textAlign = 'left'; // 文字对齐
      context!.textBaseline = 'middle'; // 基线对齐
      context!.shadowColor = 'rgba(0, 0, 0, 0.8)'; // 阴影颜色
      context!.shadowBlur = 5; // 阴影模糊
      context!.shadowOffsetX = 2; // 阴影X偏移
      context!.shadowOffsetY = 2;

      context!.fillText(time, 24, height - fontSize * 2);

      context!.font = `italic bold ${fontSize * 0.8}px Arial, sans-serif`; // 字体样式
      context!.fillText(text, 24, height - fontSize);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        },
        `image/${type}`,
        0.9,
      );
    };
    url = URL.createObjectURL(fileObj);
    image.src = url;
  });
}

type Value = {
  fileObj: any;
  file: UploadFile;
  text: string;
  time: string;
  objectUrl: string;
  watermarkBlob?: Blob;
  type: string;
  key: string;
};

async function fetchPosition(metadata: any) {
  const { latitude, longitude } = metadata;
  if (latitude === undefined) return {};
  const response = await reverseGeocoding(longitude, latitude);

  const {
    addressComponent: { city, province },
  } = response;

  return { text: `${province}${city}` };
}

const ImageDom = (props: {
  value: Value;
  onChange: (value: Partial<Value>, action: 'edit' | 'delete') => void;
  checked: boolean;
  onChecked: () => void;
}) => {
  const { value, onChange, checked, onChecked } = props;
  const { objectUrl, time, text, file, fileObj, type } = value;

  const [loading, setLoading, getLoading] = useGetState(true);
  const [stateText, setStateText] = useState(text);

  const update = useUpdate();

  const objectUrlRef = useRef(objectUrl);
  const meta = useRef<any>({});

  const handlePosition = useCallback(async() => {
    const editInfo = await fetchPosition(meta.current);
    onChange(editInfo, 'edit')
  }, []);

  useEffect(() => {
    async function getData() {
      setLoading(true);

      let allMetadata: any = {}

      try {
        allMetadata = await exifr.parse(file.originFileObj! || file);
      }catch(err) {}

      // const editInfo = await fetchPosition(allMetadata);

      meta.current = allMetadata;

      setLoading(false);

      onChange(
        {
          // ...editInfo,
          time: allMetadata.DateTimeOriginal
            ? dayjs(allMetadata.DateTimeOriginal).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
        },
        'edit',
      );
    }

    getData();
  }, []);

  useDebounceEffect(
    () => {
      let url = '';
      generateWatermark(
        fileObj,
        type,
        dayjs(time).format('YYYY-MM-DD'),
        text,
      ).then((blob) => {
        if (blob) {
          url = URL.createObjectURL(blob as any);
          objectUrlRef.current = url;
          onChange(
            {
              objectUrl: url,
              watermarkBlob: blob as any,
            },
            'edit',
          );
          update();
        }
      });

      return () => {
        URL.revokeObjectURL(objectUrlRef.current);
      };
    },
    [time, text],
    {
      wait: 1000,
    },
  );

  useEffect(() => {
    setStateText(text);
  }, [text]);

  return (
    <div className={styles['image-dom']}>
      {loading && (
        <div className={styles['image-dom-mask']}>
          <Spin tip="信息加载中" size="small" />
        </div>
      )}
      <Checkbox
        className={styles['image-dom-check']}
        checked={checked}
        onChange={onChecked}
      />
      <img src={objectUrlRef.current} />
      <div>
        <DatePicker
          value={dayjs(time)}
          onChange={(newTime) =>
            onChange({ time: dayjs(newTime).format('YYYY-MM-DD') }, 'edit')
          }
          style={{ marginBottom: 4, width: '100%' }}
        />
        <TextArea
          value={stateText}
          rows={2}
          onBlur={(e) => onChange({ text: stateText }, 'edit')}
          onChange={(e) => setStateText(e.target.value)}
          style={{ marginBottom: 4, width: '100%' }}
        />
      </div>
      <Button
        block
        style={{ marginTop: 4, marginBottom: 4 }}
        onClick={handlePosition}
      >
        获取定位
      </Button>
      <Button
        block
        style={{ marginTop: 4, marginBottom: 12 }}
        danger
        onClick={() => onChange(value, 'delete')}
      >
        删除
      </Button>
    </div>
  );
};

function useStateValue(
  value: Value[] = [],
): [Value[], (value: Value[] | ((prev: Value[]) => Value[])) => void] {
  const update = useUpdate();
  const valueRef = useRef<Value[]>(value);
  return [
    valueRef.current,
    (value: Value[] | ((prev: Value[]) => Value[])) => {
      if (Array.isArray(value)) {
        valueRef.current = value;
      } else {
        valueRef.current = value(valueRef.current);
      }
      update();
    },
  ];
}

const ImageWatermark = () => {
  const [value, setValue] = useStateValue([]);
  const [selectList, setSelectList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const beforeUpload = useCallback(
    async (file, fileList: UploadFile[]) => {
      if (fileList[fileList.length - 1] !== file) return false;
      setLoading(true);
      const startIndex = value.length;
      let newValue: Value[] = [...value];
      for (let index = 0; index < fileList.length; index++) {
        const file = fileList[index];
        const src = (file.url || file.name || '').toLowerCase();
        let jpegBlob: any = file.originFileObj! || file;
        let [, type] = file.type!.split('/');

        if (src.match(/\.heic$/i)) {
          jpegBlob = await heic2any({
            blob: new Blob([file.originFileObj! || file]),
            toType: 'image/jpeg',
          });
          type = 'jpeg';
        }

        const object = {
          key: (index + startIndex).toString(),
          fileObj: jpegBlob,
          objectUrl: URL.createObjectURL(jpegBlob),
          file,
          text: '',
          time: dayjs().format('YYYY-MM-DD'),
          type: type.toLowerCase(),
        };
        newValue.push(object);
      }
      setValue(newValue);
      setLoading(false);
      return false;
    },
    [value],
  );

  const handleSave = useCallback(async () => {
    setDownloadLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      // 创建一个新的JSZip对象
      const zip = new JSZip();

      // 异步下载每个文件并添加到zip中
      for (let index = 0; index < value.length; index++) {
        const fileObject = value[index];
        const { watermarkBlob, type, fileObj } = fileObject;
        zip.file(
          `${Date.now()}-${index + 1}.${type || 'jpeg'}`,
          watermarkBlob as any,
        );
      }

      // 生成ZIP文件的blob对象
      const content = await zip.generateAsync({ type: 'blob' });
      // 使用file-saver触发文件下载
      saveAs(content, 'bundle.zip');
    } catch (error) {
      message.info('下载失败');
    }

    setDownloadLoading(false);
  }, [value]);

  const handleEditTime = useCallback(() => {
    let date = dayjs();
    modal.confirm({
      title: '修改时间',
      content: (
        <DatePicker
          style={{ width: '100%' }}
          defaultValue={date}
          onChange={(value) => (date = value)}
        />
      ),
      onOk: () => {
        const newValue = value.reduce<Value[]>((acc, item) => {
          const { key } = item;
          if (selectList.includes(key)) {
            return [
              ...acc,
              {
                ...item,
                time: date.format('YYYY-MM-DD'),
              },
            ];
          }
          return [...acc, item];
        }, []);
        setValue(newValue);
        setSelectList([]);
      },
    });
  }, [selectList, value]);

  const handleEditPosition = useCallback(() => {
    let text = '';
    modal.confirm({
      title: '修改位置',
      content: (
        <TextArea
          defaultValue={text}
          onChange={(e) => (text = e.target.value)}
        />
      ),
      onOk: () => {
        const newValue = value.reduce<Value[]>((acc, item, index) => {
          const { key } = item;
          if (selectList.includes(key)) {
            return [
              ...acc,
              {
                ...item,
                text,
              },
            ];
          } else {
            return [...acc, item];
          }
        }, []);
        setValue(newValue);
        setSelectList([]);
      },
    });
  }, [selectList, value]);

  const onImageChange = useCallback(
    (index, newValue, action) => {
      setValue((prev) => {
        let targetValue = prev[index];
        const nextValue = [...prev];
        if (action === 'delete') {
          nextValue.splice(index, 1);
        } else {
          targetValue = {
            ...targetValue,
            ...newValue,
          };
          nextValue.splice(index, 1, targetValue);
        }
        return [...nextValue];
      });
      setSelectList([]);
    },
    [value],
  );

  const handleDelete = useCallback(() => {
    setValue([]);
  }, []);

  return (
    <div className={styles['image-watermark']}>
      <div className={styles['image-watermark-content']}>
        <Upload
          multiple
          fileList={[]}
          beforeUpload={beforeUpload}
          accept="image/*"
        >
          <Button
            style={{ marginBottom: value.length ? 24 : 0 }}
            loading={loading}
            icon={<UploadOutlined />}
          >
            选择图片上传
          </Button>
        </Upload>
        <Row gutter={24}>
          {value.map((item, index) => {
            const selectIndex = selectList.indexOf(item.key);
            const checked = !!~selectIndex;
            return (
              <Col key={item.key} span={6}>
                <ImageDom
                  checked={checked}
                  onChecked={() => {
                    const newValue = [...selectList];
                    if (checked) {
                      newValue.splice(selectIndex, 1);
                    } else {
                      newValue.push(item.key);
                    }
                    setSelectList(newValue);
                  }}
                  value={item}
                  onChange={onImageChange.bind(null, index)}
                />
              </Col>
            );
          })}
        </Row>
      </div>
      <div className={styles['image-watermark-save']}>
        <Button danger style={{ marginRight: 24 }} onClick={handleDelete}>
          清空
        </Button>
        <Button
          variant="solid"
          style={{ marginRight: 24 }}
          onClick={() =>
            setSelectList(
              value.length === selectList.length
                ? []
                : value.map((item) => item.key),
            )
          }
          disabled={!value.length}
        >
          {value.length === selectList.length ? '取消全选' : '全选'}
        </Button>
        <Button
          style={{ marginRight: 24 }}
          disabled={!selectList.length}
          onClick={handleEditTime}
        >
          批量更改时间
        </Button>
        <Button
          style={{ marginRight: 24 }}
          disabled={!selectList.length}
          onClick={handleEditPosition}
        >
          批量更改定位
        </Button>
        <Button
          loading={downloadLoading}
          disabled={!value.length}
          type="primary"
          onClick={handleSave}
        >
          保存
        </Button>
      </div>
    </div>
  );
};

export default ImageWatermark;
