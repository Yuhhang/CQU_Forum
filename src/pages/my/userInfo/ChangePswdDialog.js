import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useContext, useState } from 'react';
import instance from '../../../components/axios';
import userContext from '../../../context/userContext';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  paper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '400px',
    padding: theme.spacing(3, 2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ChangePswdDialog() {
  const context = useContext(userContext);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [values, setValues] = React.useState({
    oldPswd: '',
    newPswd: '',
    newPswdValidate: '',
    showPassword: false,
    pswdErr: false,
    pswdErrText: '',
    showProgress: false,
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function checkPassword() {
    if (values.oldPswd === '') {
      setValues({ ...values, pswdErr: true, pswdErrText: '请填写旧密码' });
      return false;
    }
    if (values.newPswd === '') {
      setValues({ ...values, pswdErr: true, pswdErrText: '请填写密码' });
      return false;
    }
    const pswdReg = /^\S{6,18}$/;
    if (!pswdReg.test(values.newPswd)) {
      setValues({ ...values, pswdErr: true, pswdErrText: '密码6-18位，不能包含空格' });
      return false;
    }
    return true;
  }

  function checkPswdSame() {
    if (values.newPswd !== values.newPswdValidate) {
      setValues({ ...values, pswdErr: true, pswdErrText: '两次密码输入不一致' });
      return false;
    }
    return true;
  }

  function handleSubmit() {
    if (!checkPassword()) return;
    if (!checkPswdSame()) return;
    setValues({ ...values, showProgress: true });

    const url = 'changePswd/';
    instance.post(url, {
      oldPswd: values.oldPswd,
      newPswd: values.newPswd,
    })
      .then((res) => {
        if (res.data.status === 'success') {
          handleClose();
          context.setShowMsgBar('success', '密码修改成功');
          setValues({
            ...values,
            oldPswd: '',
            newPswd: '',
            newPswdValidate: '',
          });
        } else {
          context.setShowMsgBar('fail', res.data.msg);
        }
        setValues({
          ...values, showProgress: false,
        });
      })
      .catch(() => {
        // handle error
        context.setShowMsgBar('fail', '网络错误');
        setValues({
          ...values, showProgress: false,
        });
      });
  }
  // 输入处理函数
  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function canclePswdErr() {
    if (values.pswdErr === true) {
      setValues({ ...values, pswdErr: false, pswdErrText: '' });
    }
  }
  // 是否显示密码
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  return (
    <div>
      <MenuItem
        onClick={handleClickOpen}
      >
        修改密码
      </MenuItem>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              修改密码
            </Typography>
            <Button
              color="inherit"
              onClick={handleSubmit}
              disabled={values.showProgress}
            >
              提交
            </Button>
          </Toolbar>
        </AppBar>
        {values.showProgress
          && <LinearProgress />
        }
        <Paper className={classes.paper}>
          <FormControl className={classes.textField} style={{ marginBottom: '20px' }}>
            <InputLabel htmlFor="oldPassword">旧密码</InputLabel>
            <Input
              id="oldPassword"
              type="password"
              value={values.oldPswd}
              onChange={handleChange('oldPswd')}
            />
          </FormControl>
          <FormControl className={classes.textField}>
            <InputLabel htmlFor="password">新密码</InputLabel>
            <Input
              error={values.pswdErr}
              id="password"
              type={values.showPassword ? 'text' : 'password'}
              value={values.newPswd}
              onChange={handleChange('newPswd')}
              onFocus={canclePswdErr}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
            />
            <FormHelperText error={values.pswdErr}>
              {values.pswdErrText}
            </FormHelperText>
          </FormControl>
          <FormControl className={classes.textField}>
            <InputLabel htmlFor="passwordValidate">再次输入密码</InputLabel>
            <Input
              error={values.pswdErr}
              id="passwordValidate"
              type="password"
              onChange={handleChange('newPswdValidate')}
            />
          </FormControl>
        </Paper>
      </Dialog>
    </div>
  );
}
