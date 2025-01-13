import type { ModalFormProps } from '@ant-design/pro-components';
import { ModalForm as AntModalForm } from '@ant-design/pro-components';
import { useSize } from 'ahooks';
import type { ModalProps } from 'antd';
import { Modal as AntModal } from 'antd';
import { merge } from 'lodash';

export const ModalForm = <T = Record<string, any>, U = Record<string, any>>(
  props: ModalFormProps<T, U>,
) => {
  const { height = 600 } = useSize(() => document.body) || {};

  return (
    <AntModalForm
      {...props}
      modalProps={merge(props.modalProps, {
        styles: {
          body: {
            overflowY: 'auto',
            maxHeight: height * 0.8 - 100 - 20 - 24,
          },
        },
      })}
    />
  );
};

export const Modal = (props: ModalProps) => {
  const { height = 600 } = useSize(() => document.body) || {};

  return (
    <AntModal
      {...props}
      styles={merge(props.styles, {
        body: {
          overflowY: 'auto',
          maxHeight: height * 0.8 - 100 - 20 - 24,
        },
      })}
    />
  );
};
