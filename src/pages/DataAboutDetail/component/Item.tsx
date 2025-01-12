import Upload from '@/components/Upload';
import {
  deleteActorInfo,
  deleteClassifyInfo,
  deleteDirectorInfo,
  deleteDistrictInfo,
  deleteLanguageInfo,
  getActorInfo,
  getClassifyInfo,
  getDirectorInfo,
  getDistrictInfo,
  getLanguageInfo,
  postActorInfo,
  postClassifyInfo,
  postDirectorInfo,
  postDistrictInfo,
  postLanguageInfo,
  putActorInfo,
  putClassifyInfo,
  putDirectorInfo,
  putDistrictInfo,
  putLanguageInfo,
} from '@/services';
import { formatUrl } from '@/utils';
import { SOURCE_TYPE } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  List,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { Fragment } from 'react';
import { localFetchData4Array } from '../../DataEdit/utils';
import styles from '../style.less';

const { Text, Paragraph } = Typography;

export type TPath = keyof typeof AboutInfo;

export type TDeleteActionType = (id: string) => void;
export type TEditActionType = TDeleteActionType;
export type TAddActionType = () => void;

type OperationType = {
  deleteItem: TDeleteActionType;
  editItem: TEditActionType;
  addItem: TAddActionType;
};

const format = (date: string, formatText = 'MM-DD') =>
  dayjs(date).format(formatText);

function actions<T extends { _id: string }>(
  operation: OperationType,
  value: T,
) {
  const { deleteItem, editItem } = operation;
  const { _id } = value;
  return [
    <Button onClick={() => deleteItem(_id)} key="option1" danger type="link">
      删除
    </Button>,
    <Button onClick={() => editItem(_id)} key="option2" type="link">
      编辑
    </Button>,
  ];
}

function addButton(operation: OperationType, children: string) {
  const { addItem } = operation;
  return (
    <List.Item>
      <Button
        onClick={() => addItem()}
        type="dashed"
        className={styles.newButton}
      >
        <PlusOutlined /> {children}
      </Button>
    </List.Item>
  );
}

export const AboutInfo = {
  actor: {
    fetchData: async (values: API_DATA.IGetActorInfoParams) => {
      const data = (await getActorInfo(values)) || {};
      if (!values || !values['_id']) return data;
      const form: API_DATA.IGetActorInfoResData = Array.isArray(data.list)
        ? data.list[0]
        : data.list;
      if (!form) return {};
      const { country, another_name, avatar, avatar_id, ...nextForm } = form;
      return {
        ...nextForm,
        alias: another_name,
        avatar: Array.isArray(avatar) ? avatar : [avatar],
        avatar_id: Array.isArray(avatar_id) ? avatar_id : [avatar_id],
        country: country?.['_id'],
      };
    },
    delete: deleteActorInfo,
    edit: (values: API_DATA.IPutActorInfoParams & { avatar_id: string }) => {
      const { avatar_id, ...nextValues } = values;
      return putActorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar_id) ? avatar_id[0] : avatar_id,
      });
    },
    add: (values: API_DATA.IPostActorInfoParams & { avatar_id: string }) => {
      const { avatar_id, ...nextValues } = values;
      return postActorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar_id) ? avatar_id[0] : avatar_id,
      });
    },
    renderItem(operation: OperationType) {
      return function render(
        item: API_DATA.IGetActorInfoResData,
      ): React.ReactNode {
        const { _id, another_name, name, createdAt, avatar, source_type } =
          item;
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={actions(operation, item)}
              >
                <Card.Meta
                  avatar={
                    <Image
                      alt=""
                      className={styles.cardAvatar}
                      src={formatUrl(avatar)}
                      preview
                    />
                  }
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          别名: <Text>{another_name}</Text>
                        </div>
                        <div>
                          来源类型:{' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间:{' '}
                          <Text code title={format(createdAt, 'YYYY-MM-DD')}>
                            {format(createdAt)}
                          </Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          );
        }

        return addButton(operation, '新增演员信息');
      };
    },
    renderForm() {
      return (
        <Fragment>
          <ProFormText
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText name="alias" label="别名" />
          <Upload
            wrapper={{
              name: 'avatar_id',
              label: '海报',
            }}
            item={{
              maxFiles: 1,
              acceptedFileTypes: ['image/*'],
              allowMultiple: false,
            }}
          />
          <ProFormSelect
            request={() =>
              localFetchData4Array<
                API_DATA.IGetDistrictInfoResData,
                API_DATA.IGetDistrictInfoRes
              >(getDistrictInfo, { all: 1 })(
                ['_id', 'value'],
                ['name', 'label'],
                (data) => data.list,
              )
            }
            name="country"
            label="地区"
            hasFeedback
            showSearch
            placeholder="请选择地区"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
        </Fragment>
      );
    },
  },
  director: {
    fetchData: async (values: API_DATA.IGetDirectorInfoResData) => {
      const data = await getDirectorInfo(values);
      if (!values || !values['_id']) return data;
      const form: API_DATA.IGetDirectorInfoResData = Array.isArray(data.list)
        ? data.list[0]
        : data.list;
      if (!form) return {};
      const { country, another_name, avatar, avatar_id, ...nextForm } = form;
      return {
        ...nextForm,
        alias: another_name,
        avatar: Array.isArray(avatar) ? avatar : [avatar],
        avatar_id: Array.isArray(avatar_id) ? avatar_id : [avatar_id],
        country: country?.['_id'],
      };
    },
    delete: deleteDirectorInfo,
    edit: (values: API_DATA.IPutDirectorInfoParams & { avatar_id: string }) => {
      const { avatar_id, ...nextValues } = values;
      return putDirectorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar_id) ? avatar_id[0] : avatar_id,
      });
    },
    add: (values: API_DATA.IPostDirectorInfoParams & { avatar_id: string }) => {
      const { avatar_id, ...nextValues } = values;
      return postDirectorInfo({
        ...nextValues,
        avatar: Array.isArray(avatar_id) ? avatar_id[0] : avatar_id,
      });
    },
    renderItem(operation: OperationType) {
      return function render(
        item: API_DATA.IGetDirectorInfoResData,
      ): React.ReactNode {
        const { _id, another_name, name, createdAt, avatar, source_type } =
          item;
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={actions(operation, item)}
              >
                <Card.Meta
                  avatar={
                    <Image
                      alt=""
                      className={styles.cardAvatar}
                      src={formatUrl(avatar)}
                      preview
                    />
                  }
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          别名: <Text>{another_name}</Text>
                        </div>
                        <div>
                          来源类型:{' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间:{' '}
                          <Text code title={format(createdAt, 'YYYY-MM-DD')}>
                            {format(createdAt)}
                          </Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          );
        }

        return addButton(operation, '新增导演信息');
      };
    },
    renderForm() {
      return (
        <Fragment>
          <ProFormText
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText name="alias" label="别名" />
          <Upload
            wrapper={{
              name: 'avatar_id',
              label: '海报',
            }}
            item={{
              maxFiles: 1,
              acceptedFileTypes: ['image/*'],
              allowMultiple: false,
            }}
          />
          <ProFormSelect
            request={() =>
              localFetchData4Array<
                API_DATA.IGetDistrictInfoResData,
                API_DATA.IGetDistrictInfoRes
              >(getDistrictInfo)(
                ['_id', 'value'],
                ['name', 'label'],
                (data) => data.list,
              )
            }
            name="country"
            label="地区"
            hasFeedback
            showSearch
            placeholder="请选择地区"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
        </Fragment>
      );
    },
  },
  classify: {
    fetchData: async (values: API_DATA.IGetClassifyInfoParams) => {
      const data = await getClassifyInfo(values);
      if (!values || !values['_id']) return data;
      const form: API_DATA.IGetClassifyInfoResData = Array.isArray(data.list)
        ? data.list[0]
        : data.list;
      if (!form) return {};
      const { icon, icon_id, ...nextForm } = form;
      return {
        ...nextForm,
        icon: Array.isArray(icon) ? icon : [icon],
        icon_id: Array.isArray(icon_id) ? icon_id : [icon_id],
      };
    },
    delete: deleteClassifyInfo,
    edit: (values: API_DATA.IPutClassifyInfoParams & { icon_id: string }) => {
      const { icon, icon_id, ...nextValues } = values;
      return putClassifyInfo({
        ...nextValues,
        icon: Array.isArray(icon_id) ? icon_id[0] : icon_id,
      });
    },
    add: (values: API_DATA.IPostClassifyInfoParams & { icon_id: string }) => {
      const { icon, icon_id, ...nextValues } = values;
      return postClassifyInfo({
        ...nextValues,
        icon: Array.isArray(icon_id) ? icon_id[0] : icon_id,
      });
    },
    renderItem(operation: OperationType) {
      return function render(
        item: API_DATA.IGetClassifyInfoResData,
      ): React.ReactNode {
        const { _id, name, createdAt, glance, icon, source_type } = item;
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={actions(operation, item)}
              >
                <Card.Meta
                  avatar={
                    <Image
                      alt=""
                      className={styles.cardAvatar}
                      src={formatUrl(icon)}
                      preview
                    />
                  }
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          浏览人数: <Text>{glance || 0}</Text>
                        </div>
                        <div>
                          来源类型:{' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间:{' '}
                          <Text code title={format(createdAt, 'YYYY-MM-DD')}>
                            {format(createdAt)}
                          </Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          );
        }

        return addButton(operation, '新增分类信息');
      };
    },
    renderForm() {
      return (
        <Fragment>
          <ProFormText
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Upload
            wrapper={{
              name: 'icon_id',
              label: '图标',
            }}
            item={{
              maxFiles: 1,
              acceptedFileTypes: ['image/*'],
              allowMultiple: false,
            }}
          />
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
        </Fragment>
      );
    },
  },
  language: {
    fetchData: async (values: API_DATA.IGetLanguageInfoParams) => {
      const data = await getLanguageInfo(values);
      if (!values || !values['_id']) return data;
      const form: API_DATA.IGetLanguageInfoResData = Array.isArray(data.list)
        ? data.list[0]
        : data.list;
      return form || {};
    },
    delete: deleteLanguageInfo,
    edit: putLanguageInfo,
    add: postLanguageInfo,
    renderItem(operation: OperationType) {
      return function render(
        item: API_DATA.IGetLanguageInfoResData,
      ): React.ReactNode {
        const { _id, name, createdAt, source_type } = item;
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={actions(operation, item)}
              >
                <Card.Meta
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          来源类型:{' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间:{' '}
                          <Text code title={format(createdAt, 'YYYY-MM-DD')}>
                            {format(createdAt)}
                          </Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          );
        }

        return addButton(operation, '新增语言信息');
      };
    },
    renderForm() {
      return (
        <Fragment>
          <ProFormText
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
        </Fragment>
      );
    },
  },
  district: {
    fetchData: async (values: API_DATA.IGetDistrictInfoParams) => {
      const data = await getDistrictInfo(values);
      if (!values || !values['_id']) return data;
      const form: API_DATA.IGetDistrictInfoResData = Array.isArray(data.list)
        ? data.list[0]
        : data.list;
      return form || {};
    },
    delete: deleteDistrictInfo,
    edit: putDistrictInfo,
    add: postDistrictInfo,
    renderItem(operation: OperationType) {
      return function render(
        item: API_DATA.IGetDistrictInfoResData,
      ): React.ReactNode {
        const { _id, name, createdAt, source_type } = item;
        if (_id) {
          return (
            <List.Item key={_id}>
              <Card
                hoverable
                className={styles.card}
                actions={actions(operation, item)}
              >
                <Card.Meta
                  title={<a>{name}</a>}
                  description={
                    <Paragraph
                      className={styles.item}
                      ellipsis={{
                        rows: 3,
                      }}
                    >
                      <Space direction="vertical">
                        <div>
                          来源类型:{' '}
                          <Text strong>{SOURCE_TYPE[source_type]}</Text>
                        </div>
                        <div>
                          创建时间:{' '}
                          <Text code title={format(createdAt, 'YYYY-MM-DD')}>
                            {format(createdAt)}
                          </Text>
                        </div>
                      </Space>
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          );
        }

        return addButton(operation, '新增地区信息');
      };
    },
    renderForm() {
      return (
        <Fragment>
          <ProFormText
            name="name"
            label="名称"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Form.Item name="_id">
            <Input type="hidden" />
          </Form.Item>
        </Fragment>
      );
    },
  },
};
