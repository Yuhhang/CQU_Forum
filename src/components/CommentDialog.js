import { FormControlLabel, Switch, Fab } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import userContext from '../context/userContext';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

export default function CommentDialog(props) {
  const {
    postId,
    replyTo,
  } = props;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const context = useContext(userContext); // global user context
  const { userState } = context;
  const { isLoggedIn } = userState;
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChange(e) {
    setContent(e.target.value);
  }

  function handleSubmit() {
    // 显示加载条并禁用提交
    setShowProgress(true);

    const url = 'addComment/';
    instance.post(url, {
      post_id: postId,
      reply_to: replyTo,
      content,
      anonymous,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.comment_status === 'success') {
          context.setShowMsgBar('success', '评论成功');
          setContent('');
          return;
        }
        context.setShowMsgBar('error', '发生错误');
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
      }).finally(() => {
        handleClose();
        setShowProgress(false);
      });
  }

  return (
    <div>
      <Fab
        disabled={!isLoggedIn}
        color="primary"
        onClick={handleClickOpen}
      >
        <EditIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">发表评论</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="内容"
            value={content}
            onChange={handleChange}
            type="text"
            fullWidth
          />
        </DialogContent>
        {/* <FormControlLabel
          control={(
            <Switch
              disabled
              checked={anonymous}
              onChange={() => { setAnonymous(!anonymous); }}
              color="primary"
            />
          )}
          label="开启匿名"
        /> */}
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button onClick={handleSubmit} color="primary">
            提交
          </Button>
        </DialogActions>
        {showProgress
          && <LinearProgress />
        }
      </Dialog>
    </div>
  );
}
