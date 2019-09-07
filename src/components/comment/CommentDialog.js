import { Fab, FormControlLabel, Switch } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import React, { useContext, useState } from 'react';
import userContext from '../../context/userContext';
import instance from '../axios';

export default function CommentDialog(props) {
  const {
    postId,
    replyTo,
    replyCount,
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
      reply_to: replyTo || 0,
      content,
      anonymous,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', '评论成功');
          setContent('');
          handleClose();
          window.location.reload();
          return;
        }
        context.setShowMsgBar('error', res.data.msg);
      })
      .catch(() => {
        context.setShowMsgBar('error', '网络请求失败');
      }).finally(() => {
        setShowProgress(false);
      });
  }

  return (
    <React.Fragment>
      {replyTo && (
        <IconButton
          disabled={!isLoggedIn}
          onClick={handleClickOpen}
        >
          <ReplyIcon />
          <Typography component="span" style={{ position: 'relative', left: '2px', top: '1px' }}>
            {replyCount}
          </Typography>
        </IconButton>
      )}
      {!replyTo && (
        <Fab
          disabled={!isLoggedIn}
          color="primary"
          onClick={handleClickOpen}
        >
          <EditIcon />
        </Fab>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {replyTo ? '回复' : '发表评论'}
        </DialogTitle>
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
          <FormControlLabel
            style={{ float: 'right' }}
            control={(
              <Switch
                checked={anonymous}
                onChange={() => { setAnonymous(!anonymous); }}
                color="primary"
              />
            )}
            label="匿名发表"
          />
        </DialogContent>
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
    </React.Fragment>
  );
}
