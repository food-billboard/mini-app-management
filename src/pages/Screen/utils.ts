import { message } from 'antd';
import { Upload } from 'chunk-file-upload';
import { leadInScreen, exportScreen } from '@/services';
import { exitDataFn, uploadFn } from '@/utils/Upload';
import { saveAs } from 'file-saver';

// 导入 loading
let LEAD_IN_LOADING = false;
// 导出 loading
let EXPORT_LOADING = false;

// 文件上传
export async function upload(file: File) {
  const UPLOAD_INSTANCE = new Upload();

  let fileId: string = '';

  return new Promise((resolve, reject) => {
    const [name] = UPLOAD_INSTANCE.add({
      file: {
        file,
      },
      request: {
        exitDataFn: exitDataFn(function (data: any) {
          fileId = data._id;
        }),
        uploadFn: uploadFn(),
        callback(err) {
          if (err) {
            reject(err);
          } else {
            resolve(fileId);
          }
        },
      },
    });

    if (!name) {
      return Promise.reject();
    } else {
      UPLOAD_INSTANCE.deal(name);
    }
  })
    .then(() => {
      UPLOAD_INSTANCE.dispose();
      return fileId;
    })
    .catch((err) => {
      UPLOAD_INSTANCE.dispose();
      return Promise.reject(err);
    });
}

// 导入
export async function LeadIn(
  type: API_SCREEN.ILeadInScreenParams['type'],
  callback?: () => void,
) {
  if (LEAD_IN_LOADING) return;
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'application/json');
  input.addEventListener('change', (e: any) => {
    const file = e.target?.files[0];
    if (file) {
      LEAD_IN_LOADING = true;
      message.info('导入中...');
      upload(file)
        .then((data) => {
          return leadInScreen({
            type,
            _id: data,
          });
        })
        .then(() => {
          message.info('文件导入成功');
        })
        .catch(() => {
          message.info('文件导入失败');
        })
        .then(() => {
          LEAD_IN_LOADING = false;
          callback?.();
        });
    }
  });
  input.click();
}

// 导出
export async function exportData(params: {
  _id: string;
  type: API_SCREEN.ILeadInScreenParams['type'];
}) {
  if (EXPORT_LOADING) return;

  EXPORT_LOADING = true;

  return exportScreen(params)
    .then((value: any) => {
      const { headers } = value;
      const disposition = headers['content-disposition'] || '';
      const filename = disposition.replace(/.+filename=/, '');
      return saveAs(
        new Blob([value.data], { type: 'application/json' }),
        decodeURIComponent(filename),
      );
    })
    .catch(() => {
      message.info('导出文件失败');
    })
    .then(() => {
      EXPORT_LOADING = false;
    });
}
