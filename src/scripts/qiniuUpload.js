import * as qiniu from 'qiniu-js';
import instance from '../components/axios';

const config = {
  useCdnDomain: true,
  region: qiniu.region.z2,
};
const putExtra = {
  fname: '',
  params: {},
  mimeType: ['image/png', 'image/jpeg', 'image/gif'] || null,
};
const folderPath = 'postImg/';

function upload(file, fileName, token) {
  return new Promise((resolve, reject) => {
    const observer = {
      next(res) {
        // ...
      },
      error(err) {
        reject(err);
      },
      complete() {
        resolve();
      },
    };
    const observable = qiniu.upload(
      file,
      fileName,
      token,
      putExtra,
      config,
    );
    const subscription = observable.subscribe(observer);
  });
}
export default function qiniuUpload(files, postId) {
  return new Promise((resolve, reject) => {
    instance.get('getUploadToken/')
      .then((res) => {
        if (res.data.status !== 'success') {
          reject();
        }
        let fileNameCnt = 0;
        // let fileNames = [];
        let uploads = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${folderPath}${postId}_${fileNameCnt}`;
          // fileNames.push(`${postId}_${fileNameCnt}`);
          fileNameCnt++;
          uploads.push(upload(file, fileName, res.data.token));
        }
        Promise.all(uploads)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
