import React, { useMemo, Children, cloneElement } from 'react';
import type { ReactNode } from 'react';
import { Dropdown, Button, Space } from 'antd';
import type { DropDownProps } from 'antd';

const TableAction = (props: {
  children?: ReactNode;
  dropDownProps?: Partial<DropDownProps> & { children?: ReactNode };
}) => {
  const { children, dropDownProps } = props;

  const realChildren = useMemo(() => {
    const list = Children.toArray(children);
    if (list.length <= 3)
      return list.map((item: any) => {
        return cloneElement(item, {
          style: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        });
      });
    return (
      <>
        {list.slice(0, 2).map((item: any) => {
          return cloneElement(item, {
            style: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          });
        })}
        <Dropdown
          {...dropDownProps}
          menu={{
            items: list.slice(2).map((item: any, index) => {
              return {
                key: item.key || index.toString(),
                label: cloneElement(item, {
                  style: {
                    padding: 0,
                    height: 'auto',
                  },
                }) as any,
              };
            }),
          }}
        >
          <Button style={{ padding: 0 }} type="link">
            更多
          </Button>
        </Dropdown>
      </>
    );
  }, [children, dropDownProps]);

  return <Space>{realChildren}</Space>;
};

export default TableAction;
