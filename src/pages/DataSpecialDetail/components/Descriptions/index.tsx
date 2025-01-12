import { ProDescriptions, ProProvider } from '@ant-design/pro-components';
import { Card, Tag } from 'antd';
import { pick } from 'lodash';
import { memo, useCallback, useContext, useMemo, useRef } from 'react';
import Upload, { PreImage } from './upload';

interface IProps {
  loading?: boolean;
  onChange: (
    value: Partial<API_INSTANCE.IPutInstanceSpecialParams>,
  ) => Promise<void>;
  value?: API_INSTANCE.IGetInstanceSpecialData;
}

export default memo((props: IProps) => {
  const values = useContext(ProProvider);

  const actionRef = useRef();

  const { loading, onChange, value } = useMemo(() => {
    return props;
  }, [props]);

  const columns = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        valueType: 'text',
        key: 'name',
        span: 2,
      },
      {
        title: '是否启用',
        dataIndex: 'valid',
        valueType: 'switch',
        key: 'valid',
        span: 1,
        render: (valid: any) => {
          return (
            <Tag color={valid ? 'lime' : 'red'}>{valid ? '启用' : '禁用'}</Tag>
          );
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        valueType: 'textarea',
        key: 'description',
        span: 3,
      },
      {
        title: '海报',
        dataIndex: 'poster',
        key: 'poster',
        valueType: 'poster',
        span: 3,
      },
    ];
  }, []);

  const onBaseInfoValueChange = useCallback(
    async (key: any, record: API_INSTANCE.IGetInstanceSpecialData) => {
      onChange(pick(record, [key]));
    },
    [onChange],
  );

  return (
    <ProProvider.Provider
      value={{
        ...values,
        valueTypeMap: {
          poster: {
            render: (poster: string) => {
              return <PreImage value={poster} />;
            },
            renderFormItem: (poster: any, posterProps: any) => {
              return (
                <div
                  style={{
                    width: 400,
                    height: 285,
                    overflow: 'auto',
                  }}
                >
                  <Upload value={poster} props={posterProps} />
                </div>
              );
            },
          },
        },
      }}
    >
      <Card>
        <ProDescriptions
          actionRef={actionRef}
          dataSource={value}
          column={{
            xs: 1,
            md: 3,
          }}
          style={{
            backgroundColor: 'white',
          }}
          loading={loading}
          bordered
          editable={{
            onSave: onBaseInfoValueChange,
          }}
          columns={columns}
        ></ProDescriptions>
      </Card>
    </ProProvider.Provider>
  );
});
