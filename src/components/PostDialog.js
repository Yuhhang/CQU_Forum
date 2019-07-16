import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useEffect, useState } from 'react';
import userContext from '../context/userContext';
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
  const [sectionList, setSectionList] = useState(JSON.parse(localStorage.getItem('sectionList')));
  const [titleErr, setTitleErr] = useState(false);
  const [contentErr, setContentErr] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (sectionList !== null) {
      return;
    }
    instance.get('/getSections')
      .then((res) => {
        setSectionList(res.data);
        localStorage.setItem('sectionList', JSON.stringify(res.data));
      })
      .catch(() => {
        // handle error

      }).finally(() => {

      });
  }, []);

  const validateInput = (type) => {
    switch (type) {
      case 'title':
        if (values.title.length > titleMaxLength) {
          return false;
        }
        return true;
      case 'content':
        if (values.content.length > contentMaxLength) {
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleChange = prop => (event) => {
    switch (prop) {
      case 'title':
        if (!validateInput('title') && !titleErr) {
          setTitleErr(true);
        } else if (validateInput('title') && titleErr) {
          setTitleErr(false);
        }
        break;
      case 'content':
        if (!validateInput('content') && !contentErr) {
          setContentErr(true);
        } else if (validateInput('content') && contentErr) {
          setContentErr(false);
        }
        break;
      default:
        break;
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  function handleClose() {
    setClosePostDialog();
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
    // 显示加载条并禁用提交
    setShowProgress(true);

    const url = 'addPost/';
    instance.post(url, {
      ...values,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.post_status === 'success') { // 发帖成功
          context.setClosePostDialog();
          context.setShowMsgBar('success', '发帖成功');
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生 错误');
      }).finally(() => {
        setShowProgress(false);
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
            margin="normal"
            variant="filled"
            helperText={`${values.content.length}/${contentMaxLength}`}
          />
          <TextField
            id="section"
            select
            label="分区"
            value={values.section_id}
            onChange={handleChange('section_id')}
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
            {/* {!sectionList
              && (
                <MenuItem key="0" value="0" disabled>
                  加载失败
                </MenuItem>
              )} */}
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
