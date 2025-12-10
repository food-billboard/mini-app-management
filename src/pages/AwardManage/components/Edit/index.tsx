import { ModalForm } from '@/components/ProModal';
import UploadForm from '@/components/Upload';
import { SCORE_AWARD_CYCLE_TYPE_ARRAY } from '@/utils';
import {
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProFormSwitch
} from '@ant-design/pro-components';
import type { ButtonProps } from 'antd';
import { Button, Form, Input } from 'antd';
import type { Store } from 'antd/lib/form/interface';
import { ReactNode, useCallback, useState } from 'react';
import { fileValidator } from '../../../DataEdit/utils';

type FormData = API_SCORE.PutScoreAwardParams | API_SCORE.PostScoreAwardParams;

type IProps = {
  onCancel?: () => any;
  onSubmit?: (data: FormData) => any;
  children?: ReactNode;
  value?: API_SCORE.GetScoreAwardData;
  extraButtonProps?: ButtonProps;
};

const CreateForm = (props: IProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const {
    onCancel: propsCancel,
    onSubmit,
    children,
    value,
    extraButtonProps,
  } = props;

  const [formRef] = Form.useForm();

  const open = useCallback(async () => {
    const isEdit = !!value;

    const show = () => {
      setVisible(true);
    };

    show();

    if (isEdit) {
      formRef.setFieldsValue({
        ...value,
        enable: value.enable === 'ENABLE'
      });
    }
  }, [value]);

  const onCancel = useCallback(() => {
    setVisible(false);
    formRef.resetFields();
    propsCancel?.();
  }, [propsCancel]);

  const onVisibleChange = useCallback(
    (nowVisible: boolean) => {
      if (!nowVisible) onCancel();
      if (nowVisible !== visible) setVisible(nowVisible);
    },
    [onCancel, visible],
  );

  const onFinish = useCallback(
    async (values: Store) => {
      await onSubmit?.({
        ...values,
        enable: values.enable ? 'ENABLE' : 'DISABLE'
      } as FormData)
        .then(() => {
          setVisible(false);
          formRef.resetFields();
        })
        .catch(() => {});
    },
    [onSubmit],
  );

  return (
    <>
      <Button onClick={open} {...extraButtonProps}>
        {children}
      </Button>
      <ModalForm
        title={`${value ? '编辑' : '新增'}积分奖品`}
        open={visible}
        // @ts-ignore
        form={formRef}
        onFinish={onFinish}
        onOpenChange={onVisibleChange}
        modalProps={{
          styles: {
            body: {
              height: 500,
              overflowY: 'auto',
            },
          },
        }}
      >
        <ProFormTextArea
          required
          name="award_name"
          placeholder="请输入奖品名称"
          label="奖品名称"
          fieldProps={{
            autoSize: true,
          }}
        />
        <ProFormSwitch
          required
          name="enable"
          label="是否启用"
          initialValue
        />
        <ProFormTextArea
          name="award_description"
          placeholder="请输入描述信息"
          label="描述信息"
          fieldProps={{
            autoSize: true,
          }}
        />
        <UploadForm
          wrapper={{
            label: '图片',
            name: 'award_image_list',
            rules: [
              {
                required: true,
                validator: fileValidator(1),
                validateTrigger: 'onBlur',
              },
            ],
          }}
          item={{
            acceptedFileTypes: ['image/*'],
          }}
        />
        <ProFormSelect
          name="award_cycle"
          label="兑换周期"
          options={SCORE_AWARD_CYCLE_TYPE_ARRAY}
          initialValue={'NONE'}
          fieldProps={{
            onSelect: (value) => {
              if (value === 'NONE') {
                formRef.setFieldsValue({
                  award_cycle_count: 0,
                });
              }
            },
          }}
        />
        <ProFormDependency name={['award_cycle']}>
          {({ award_cycle }) => {
            return (
              <ProFormDigit
                name="award_cycle_count"
                placeholder="请输入兑换周期次数"
                label="兑换周期次数"
                initialValue={1}
                disabled={award_cycle === 'NONE'}
              />
            );
          }}
        </ProFormDependency>
        <ProFormDigit
          required
          name="inventory"
          placeholder="请输入库存"
          label="库存"
          initialValue={1}
        />
        <ProFormDigit
          required
          name="exchange_score"
          placeholder="请输入所需积分"
          label="所需积分"
          initialValue={1}
        />
        <Form.Item name="_id">
          <Input type="hidden" />
        </Form.Item>
      </ModalForm>
    </>
  );
};

export default CreateForm;
