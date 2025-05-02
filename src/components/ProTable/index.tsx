import { modal } from '@/components/Toast';
import type { ProTableProps as AntProTableProps } from '@ant-design/pro-components';
import { ProTable as AntProTable } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { Button } from 'antd';
import { ReactNode, useRef } from 'react';
import PageContainer, { PageContainerProps } from '../PageContainer';

type Action<DataSource> = (record: DataSource[]) => Promise<boolean | void>;

export type ProTableProps<DataSource, U, ValueType = 'text'> = AntProTableProps<
  DataSource,
  U,
  ValueType
> & {
  action: {
    show?: boolean;
    remove?:
      | false
      | {
          // 调接口
          action: Action<DataSource>;
          // 是否可以多选操作
          multiple?:
            | boolean
            | Partial<{
                label?: ReactNode;
              }>;
          label?: ReactNode;
          disabled?: false | ((record: DataSource[]) => boolean);
        };
  };
  // 自定义的操作按钮渲染
  extraActionRender?: (record: DataSource, index: number) => ReactNode;
};

const ProTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType>,
) => {
  const {
    columns: propsColumns = [],
    action,
    extraActionRender,
    toolBarRender,
    ...nextProps
  } = props;

  const { remove = false, show = true } = action || {};

  const actionLoading = useRef(false);

  // 删除函数
  const handleRemove = (record: DataType[], action: Action<DataType>) => {
    if (actionLoading.current) return;
    actionLoading.current = true;
    modal.confirm({
      title: '提示',
      content: '是否确认删除？',
      onOk: async () => {
        try {
          const result = await action(record);
          actionLoading.current = false;
          if (typeof result !== 'boolean' || result) {
            return Promise.resolve();
          }
          return Promise.reject();
        } catch (err) {
          actionLoading.current = false;
          return Promise.reject();
        }
      },
      onCancel: () => {
        actionLoading.current = false;
      },
    });
  };

  // 删除操作
  const removeAction = (record: DataType[], multipleAction = false) => {
    if (!remove) return null;
    const {
      action,
      multiple = true,
      label = '删除',
      disabled = false,
    } = remove;
    if (multipleAction && multiple === false) {
      return null;
    }
    return (
      <Button
        type={multipleAction ? 'default' : 'text'}
        danger
        style={multipleAction ? {} : { paddingLeft: 0 }}
        onClick={() => {
          handleRemove(record, action);
        }}
        disabled={
          multipleAction
            ? disabled === false
              ? !record.length
              : disabled(record)
            : typeof disabled === 'boolean'
            ? disabled
            : disabled(record)
        }
      >
        {multipleAction
          ? multiple && (multiple === true ? '批量删除' : multiple.label)
          : label}
      </Button>
    );
  };

  return (
    <AntProTable
      {...nextProps}
      toolBarRender={
        toolBarRender === false
          ? false
          : (action, rows) => {
              const remove = removeAction(rows.selectedRows || [], true);
              return [
                ...(toolBarRender?.(action, rows) || []),
                ...(remove ? [remove] : []),
              ];
            }
      }
      tableAlertRender={({
        selectedRowKeys,
      }: {
        selectedRowKeys: React.Key[];
        selectedRows: any[];
      }) => (
        <div>
          已选择{' '}
          <a
            style={{
              fontWeight: 600,
            }}
          >
            {selectedRowKeys.length}
          </a>{' '}
          项&nbsp;&nbsp;
          <span></span>
        </div>
      )}
      columns={[
        ...propsColumns,
        ...(show
          ? ([
              {
                valueType: 'option',
                title: '操作',
                key: 'option',
                dataIndex: 'option',
                render: (_: any, record: any, index: number) => {
                  return (
                    <>
                      {removeAction([record], false)}
                      {extraActionRender && extraActionRender(record, index)}
                    </>
                  );
                },
              },
            ] as any[])
          : []),
      ]}
    />
  );
};

export const ProPage = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: ProTableProps<DataType, Params, ValueType> & {
    containerProps?: PageContainerProps;
  },
) => {
  const { children, containerProps, ...nextProps } = props;

  return (
    <PageContainer {...containerProps}>
      <ProTable {...nextProps} />
      {children}
    </PageContainer>
  );
};

export default ProTable;
