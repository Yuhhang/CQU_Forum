import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useState, useReducer } from 'react';
import verifyEmailReducer from './reducers/verifyEmail';
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

  const [state, dispatch] = useReducer(verifyEmailReducer, {
    isSend: false,
    disableSendMail: false,
    disableSubmit: true,
    isLoading: false,
    captchaErr: false,
  });
  const {
    isSend,
    disableSendMail,
    disableSubmit,
    isLoading,
    captchaErr,
  } = state;

  const [open, setOpen] = useState(false);
  const [mailAddr, setMailAddr] = useState('');
  const [mailErr, setMailErr] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [mailResendCountdown, setMailResendCountdown] = useState(30);
  // const [mailSent, setMailSent] = useState(false);
  // const [mailResend, setMailResend] = useState(false);
  // const [showProgress, setShowProgress] = useState(false);

  const classes = useStyles();

  const validateMailAddr = () => cquMailReg.test(mailAddr);

  function handleClose() {
    setOpen(false);
  }

  async function handleSendCaptcha() {
    dispatch({ type: 'VERIFY_INIT' });

    try {
      await instance.post('mailAuth/', { captcha });

      dispatch({ type: 'VERIFY_SUCCESS' });
      setOpen(false);
      context.setShowMsgBar('success', '验证成功，请重新登录');
    } catch (err) {
      dispatch({ type: 'VERIFY_FAIL' });
      switch (err.response.status) {
        case 400:
        case 401:
        case 403:
          context.setShowMsgBar('fail', err.response.data.msg);
          break;
        case 500:
        case 502:
          context.setShowMsgBar('fail', '服务器发生错误，请稍后再试。');
          break;
        default:
          context.setShowMsgBar('fail', `发生错误${err.response.status}`);
          break;
      }
    }
  }

  function recoverSendMail() {
    let countDown = 30;
    const resendTime = setInterval(() => {
      countDown -= 1;
      setMailResendCountdown(prevTime => prevTime - 1);
      if (countDown === 0) {
        dispatch({ type: 'SENDMAIL_TIMEOUT' });
        setMailResendCountdown(30);
        clearInterval(resendTime);
      }
    }, 1000);
  }

  async function handleSendMail() {
    if (!validateMailAddr()) {
      setMailErr(true);
      return;
    }
    dispatch({ type: 'SENDMAIL_INIT' });

    try {
      await instance.post('mailAuth/', { mailAddr });

      dispatch({ type: 'SENDMAIL_SUCCESS' });
      context.setShowMsgBar('success', '发送成功，请查看邮箱');
      recoverSendMail();
    } catch (err) {
      dispatch({ type: 'SENDMAIL_FAIL' });
      switch (err.response.status) {
        case 400:
        case 401:
        case 403:
          context.setShowMsgBar('fail', err.response.data.msg);
          break;
        case 500:
        case 502:
          context.setShowMsgBar('fail', '服务器发生错误，请稍后再试。');
          break;
        default:
          context.setShowMsgBar('fail', `发生错误${err.response.status}`);
          break;
      }
    }
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
              disabled={isLoading || disableSendMail}
              onClick={handleSendMail}
            >
              {!isSend ? '发送验证码' : `重新发送${mailResendCountdown}`}
            </Button>
          </div>
          <TextField
            error={captchaErr}
            disabled={disableSubmit}
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
            disabled={isLoading || disableSubmit}
            onClick={handleSendCaptcha}
            color="primary"
          >
            验证
          </Button>
        </DialogActions>
        {isLoading
          && <LinearProgress />
        }
      </Dialog>
    </div>
  );
}
