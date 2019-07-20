import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState, useContext } from 'react';
import instance from '../../components/axios';
import userContext from '../../context/userContext';

const useStyles = makeStyles(() => ({
  dialog: {
    margin: 'auto',
    maxWidth: '600px',
  },
}));

export default function VerifyDialog() {
  const context = useContext(userContext); // global user context

  const [open, setOpen] = useState(true);
  const [mailAddr, setMailAddr] = useState('');
  const [mailErr, setMailErr] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const classes = useStyles();

  const validateMailAddr = () => {
    const cquMailReg = /\w*@cqu.edu.cn$/;
    return cquMailReg.test(mailAddr);
  };

  function handleClose() {
    setOpen(false);
  }

  function handleSendCaptcha() {
    setShowProgress(true);

    const url = 'mailAuth/';
    instance.post(url, {
      captcha,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          setOpen(false);
          context.setShowMsgBar('success', '验证成功');
        } else {
          context.setShowMsgBar('error', '验证码错误');
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
      })
      .finally(() => {
        setShowProgress(false);
      });
  }

  function handleSendMail() {
    if (!validateMailAddr()) {
      setMailErr(true);
      return;
    }
    // 显示加载条并禁用提交
    setShowProgress(true);

    const url = 'mailAuth/';
    instance.post(url, {
      mailAddr,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          setMailSent(true);
          context.setShowMsgBar('success', '发送成功，请查看邮箱');
        } else {
          context.setShowMsgBar('error', '发生错误');
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
      })
      .finally(() => {
        setShowProgress(false);
      });
  }

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
      >
        打开
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        className={classes.dialog}
      >
        <DialogTitle id="form-dialog-title">学生认证</DialogTitle>
        <DialogContent>
          <TextField
            error={mailErr}
            id="title"
            label="重庆大学邮箱"
            type="email"
            margin="normal"
            variant="filled"
            value={mailAddr}
            onChange={e => setMailAddr(e.target.value)}
            onFocus={() => {
              if (mailErr) {
                setMailErr(false);
              }
            }}
          />
          <div>
            <Button
              variant="contained"
              disabled={showProgress || mailSent}
              onClick={handleSendMail}
            >
              发送验证码
            </Button>
          </div>
          <TextField
            // error={contentErr}
            disabled={!mailSent}
            id="content"
            label="验证码"
            type="text"
            value={captcha}
            onChange={e => setCaptcha(e.target.value)}
            margin="normal"
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button
            disabled={showProgress || !mailSent}
            onClick={handleSendCaptcha}
            color="primary"
          >
            验证
          </Button>
        </DialogActions>
        {showProgress
          && <LinearProgress />
        }
      </Dialog>
    </div>
  );
}
