import React, { useCallback, useState, CSSProperties } from 'react';
import { Popover, Button } from 'antd';
import type { ButtonProps } from 'antd';
import ReactJson from 'react-json-view';
import { BugOutlined } from '@ant-design/icons';
import styles from './index.less';

export const CodeData = (props: { value: object; style?: CSSProperties }) => {
  const { value, style } = props;

  return (
    <div
      className={styles['component-code-viewer']}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <ReactJson
        src={value}
        theme="summerfruit:inverted"
        enableClipboard={true}
        onEdit={false}
        onDelete={false}
        onAdd={false}
        displayDataTypes={false}
        displayObjectSize
        indentWidth={2}
        collapseStringsAfterLength={10}
        iconStyle="square"
      />
    </div>
  );
};

const StepDataButton = (props: {
  buttonProps?: ButtonProps;
  value: object;
  codeStyle?: CSSProperties;
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { buttonProps = {}, value, codeStyle } = props;

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    setVisible((prev) => !prev);
  }, []);

  const onVisibleChange = useCallback((newVisible: boolean) => {
    if (!newVisible) setVisible(newVisible);
  }, []);

  return (
    <Popover
      trigger={'click'}
      content={<CodeData value={value} style={codeStyle} />}
      mouseEnterDelay={1}
      visible={visible}
      onVisibleChange={onVisibleChange}
      placement="top"
      overlayClassName={styles['component-code-viewer-overlay']}
    >
      <Button
        className="h-a m-r-4"
        type="link"
        icon={<BugOutlined />}
        onClick={handleClick}
        {...buttonProps}
      />
    </Popover>
  );
};

export default StepDataButton;
