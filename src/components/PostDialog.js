import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import React, { useContext, useEffect, useState } from 'react';
import userContext from '../context/userContext';
import qiniuUpload from '../scripts/qiniuUpload';
import instance from './axios';

const titleMaxLength = 20;
const contentMaxLength = 1000;

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FormDialog() {
  const context = useContext(userContext); // global user context
  const { setClosePostDialog } = context;
  const { userState } = context;

  const [values, setValues] = useState({
    title: '',
    content: '',
    section_id: 0,
    anonymous: false,
  });
  const [sectionList, setSectionList] = useState(JSON.parse(sessionStorage.getItem('sectionList')));
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [titleErr, setTitleErr] = useState(false);
  const [contentErr, setContentErr] = useState(false);
  const [sectionIdErr, setSectionIdErr] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (sectionList !== null) {
      return;
    }
    instance.get('/getSections')
      .then((res) => {
        setSectionList(res.data);
        sessionStorage.setItem('sectionList', JSON.stringify(res.data));
      })
      .catch(() => {
        // handle error

      }).finally(() => {

      });
  }, [sectionList]);

  const validateInput = (type) => {
    switch (type) {
      case 'title':
        if (values.title.length > titleMaxLength || values.title.length === 0) {
          return false;
        }
        return true;
      case 'content':
        if (values.content.length > contentMaxLength) {
          return false;
        }
        return true;
      case 'section_id':
        if (values.section_id === 0) {
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function handleClose() {
    setClosePostDialog();
  }

  function uploadFile(postId) {
    qiniuUpload(filesToUpload, postId)
      .then(() => {
        // console.log(res);
        context.setClosePostDialog();
        context.setShowMsgBar('success', '发帖成功');
        setValues({
          title: '',
          content: '',
          section_id: 0,
          anonymous: false,
        });
      })
      .catch(() => {
        context.setShowMsgBar('error', '图片上传失败');
      })
      .finally(() => {
        setShowProgress(false);
      });
  }

  function handleSubmit() {
    if (!validateInput('title')) {
      setTitleErr(true);
      return;
    }
    if (!validateInput('content')) {
      setContentErr(true);
      return;
    }
    if (!validateInput('section_id')) {
      setSectionIdErr(true);
      return;
    }
    // 显示加载条并禁用提交
    setShowProgress(true);

    const url = 'addPost/';
    instance.post(url, {
      ...values,
      imgNum: filesToUpload.length,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.post_status === 'success') { // 发帖成功
          if (filesToUpload.length !== 0) {
            uploadFile(res.data.post_id);
          } else {
            setShowProgress(false);
            context.setClosePostDialog();
            context.setShowMsgBar('success', '发帖成功');
            setValues({
              title: '',
              content: '',
              section_id: 0,
              anonymous: false,
            });
          }
        } else {
          context.setShowMsgBar('error', '发生错误');
          setShowProgress(false);
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
        setShowProgress(false);
      })
      .finally(() => {
      });
  }

  return (
    <div>
      <Dialog
        open={userState.openPostDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        scroll="body"
      >
        <DialogTitle id="form-dialog-title">发帖</DialogTitle>
        <DialogContent>
          <TextField
            error={titleErr}
            id="title"
            label="标题"
            type="text"
            margin="normal"
            variant="filled"
            value={values.title}
            onChange={handleChange('title')}
            onFocus={() => {
              if (titleErr) {
                setTitleErr(false);
              }
            }}
            fullWidth
            helperText={`${values.title.length}/${titleMaxLength}`}
          />
          <TextField
            error={contentErr}
            id="content"
            label="内容"
            type="text"
            name="content"
            multiline
            fullWidth
            rows="3"
            rowsMax="25"
            value={values.content}
            onChange={handleChange('content')}
            onFocus={() => {
              if (contentErr) {
                setContentErr(false);
              }
            }}
            margin="normal"
            variant="filled"
            helperText={`${values.content.length}/${contentMaxLength}`}
          />
          <input
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={e => setFilesToUpload(e.target.files)}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="Upload picture"
              component="span"
            >
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          {`已选择${filesToUpload.length}张图片`}
          <IconButton
            disabled={filesToUpload.length === 0}
            aria-label="Delete"
            onClick={() => setFilesToUpload([])}
          >
            <DeleteIcon />
          </IconButton>
          <TextField
            error={sectionIdErr}
            id="section"
            select
            label="分区"
            value={values.section_id}
            onChange={handleChange('section_id')}
            onFocus={() => {
              if (sectionIdErr) {
                setSectionIdErr(false);
              }
            }}
            helperText="请选择一个发帖分区"
            margin="dense"
            variant="filled"
            fullWidth
          >
            {sectionList
              && sectionList.map(item => (
                <MenuItem key={item.section_id} value={item.section_id}>
                  {item.name}
                </MenuItem>
              ))}
            {!sectionList
              && (
                <MenuItem key="0" value="0" disabled>
                  加载失败
                </MenuItem>
              )}
          </TextField>
          <FormControlLabel
            control={(
              <Switch
                disabled
                checked={values.anonymous}
                onChange={() => { setValues({ ...values, anonymous: !values.anonymous }); }}
                color="primary"
              />
            )}
            label="开启匿名"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button
            disabled={showProgress}
            onClick={handleSubmit}
            color="primary"
          >
            发布
          </Button>
        </DialogActions>
        {showProgress
          && <LinearProgress />
        }
      </Dialog>
    </div>
  );
}
