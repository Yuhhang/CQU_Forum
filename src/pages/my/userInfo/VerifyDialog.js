import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useState, useEffect } from 'react';
import instance from '../../../components/axios';
import userContext from '../../../context/userContext';

const useStyles = makeStyles(() => ({
  dialog: {
    margin: 'auto',
    maxWidth: '600px',
  },
}));
const cquMailReg = /^\w*@cqu.edu.cn$/;

export default function VerifyDialog() {
  const context = useContext(userContext); // global user context
  const { userState } = context;

  const [open, setOpen] = useState(false);
  const [mailAddr, setMailAddr] = useState('');
  const [mailErr, setMailErr] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [mailResend, setMailResend] = useState(30);
  const [showProgress, setShowProgress] = useState(false);

  const classes = useStyles();

  const validateMailAddr = () => cquMailReg.test(mailAddr);

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
          context.setShowMsgBar('success', '验证成功，请重新登录');
        } else {
          context.setShowMsgBar('error', res.data.msg);
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

  function recoverSendMail() {
    let countDown = 30;
    const resendTime = setInterval(() => {
      countDown -= 1;
      setMailResend(prevTime => prevTime - 1);
      if (countDown === 0) {
        setMailSent(false);
        setMailResend(30);
        clearInterval(resendTime);
      }
    }, 1000);
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
          context.setShowMsgBar('error', res.data.msg);
        }
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('error', '发生错误');
      })
      .finally(() => {
        setShowProgress(false);
        recoverSendMail();
      });
  }

  return (
    <div>
      <MenuItem
        onClick={() => setOpen(true)}
        disabled={userState.auth.mode !== 'unVerified'}
      >
        {userState.auth.mode === 'unVerified' ? '账号验证' : '已验证'}
      </MenuItem>
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
              {!mailSent ? '发送验证码' : `重新发送${mailResend}`}
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
