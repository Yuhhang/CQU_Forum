/* eslint-disable react/prop-types */
import axios from 'axios';
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

function LoginAndOut(props) {
  const { isLoggedIn } = props;
  const { handleClickOpen } = props;
  const { handleLogout } = props;
  if (isLoggedIn) {
    return (
      <MenuItem onClick={handleLogout}>
        <IconButton
          aria-label="Account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>登出</p>
      </MenuItem>
    );
  }
  return (
    <MenuItem onClick={handleClickOpen}>
      <IconButton
        aria-label="Account of current user"
        aria-controls="primary-search-account-menu"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <p>登录</p>
    </MenuItem>
  );
}


export default function LoginDialog(props) {
  const { handleMobileMenuClose } = props; // 打开登陆界面时关闭面板以避免键盘冲突
  const [values, setValues] = React.useState({
    username: '',
    password: '',
    passwordValidate: '',
    showPassword: false,
    passwordError: false,
    passwordErrorText: '',
    usernameError: false,
    usernameErrorText: '',
    showProgress: false,
  });
  const [open, setOpen] = React.useState(false);
  const [register, setRegister] = React.useState(false);

  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      flexBasis: 200,
    },
    showProgress: {
      display: values.showProgress ? 'block' : 'none',
    },
    showPswdHelperText: {
      display: values.passwordError ? 'block' : 'none',
    },
    showUserHelperText: {
      display: values.usernameError ? 'block' : 'none',
    },
  }));

  const classes = useStyles();

  function handleClickOpen() {
    setOpen(true);
    handleMobileMenuClose();
  }

  function handleClose() {
    setOpen(false);
  }

  function checkPswdSame() {
    if (values.password !== values.passwordValidate) {
      setValues({ ...values, passwordError: true, passwordErrorText: '两次密码输入不一致' });
      return false;
    }
    return true;
  }

  function handleLogout() {
    console.log('logout');
  }

  function handleRegister() {
    setRegister(!register);
  }

  function checkUsername() {
    if (values.username === '') {
      setValues({ ...values, usernameError: true, usernameErrorText: '请填写用户名' });
      return false;
    }
    return true;
  }

  function checkPassword() {
    if (values.password === '') {
      setValues({ ...values, passwordError: true, passwordErrorText: '请填写密码' });
      return false;
    }
    if (values.password.length <= 6) {
      setValues({ ...values, passwordError: true, passwordErrorText: '密码不能少于6位' });
      return false;
    }
    return true;
  }

  function handleLoginAndRegister() {
    if (!checkUsername()) return;
    if (!checkPassword()) return;

    if (register) {
      if (!checkPswdSame()) return;
    }

    // 取消密码错误
    if (values.passwordError === true) {
      setValues({ ...values, passwordError: false });
    }
    // 显示加载条并禁用提交
    setValues({ ...values, showProgress: true });

    let url;
    if (register) {
      url = 'register/';
    } else {
      url = 'login/';
    }
    instance.post(url, {
      username: values.username,
      pswd: values.password,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.login_status === 'success') { // 登陆成功
          setValues({ ...values, showProgress: false });
          setOpen(false);
        } else if (res.data.login_status === 'fail') { // 登陆失败
          setValues({
            ...values, passwordError: true, showProgress: false, password: '',
          });
        } else if (res.data.register_status === 'fail') { // 注册失败
          setValues({
            ...values,
            usernameError: true,
            usernameErrorText: res.data.msg,
            showProgress: false,
          });
        } else if (res.data.register_status === 'success') { // 注册成功
          setValues({
            ...values, showProgress: false,
          });
          handleRegister();
        } else { // 错误
          setValues({
            ...values, passwordError: true, showProgress: false, passwordErrorText: '网络错误',
          });
        }
      })
      .catch(() => {
        // handle error
        setValues({
          ...values, passwordError: true, showProgress: false, passwordErrorText: '网络错误',
        });
      });
  }

  function canclePswdErr() {
    if (values.password !== '' && values.passwordError === true) {
      setValues({ ...values, passwordError: false });
    }
  }

  function cancleUserErr() {
    if (values.username !== '' && values.usernameError === true) {
      setValues({ ...values, usernameError: false });
    }
  }

  // 输入处理函数（有缺陷）
  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    cancleUserErr();
    canclePswdErr();
  };


  // Enter绑定登录
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLoginAndRegister();
    }
  };

  // 是否显示密码
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  return (
    <div>
      <LoginAndOut
        isLoggedIn={false}
        handleClickOpen={handleClickOpen}
        handleLogout={handleLogout}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyPress={handleKeyPress}
      >
        <DialogTitle id="form-dialog-title">{register ? '新用户' : '登录'}</DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="username">用户名</InputLabel>
              <Input
                error={values.usernameError}
                autoFocus
                id="username"
                type="text"
                value={values.username}
                onChange={handleChange('username')}
              />
              <FormHelperText className={classes.showUserHelperText} error={values.usernameError}>
                {values.usernameErrorText}
              </FormHelperText>
            </FormControl>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <InputLabel htmlFor="password">密码</InputLabel>
              <Input
                error={values.passwordError}
                id="password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={!register && (
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
              <FormHelperText className={classes.showPswdHelperText} error={values.passwordError}>
                {values.passwordErrorText}
              </FormHelperText>
            </FormControl>
            {register
              && (
                <FormControl className={clsx(classes.margin, classes.textField)}>
                  <InputLabel htmlFor="passwordValidate">再次输入密码</InputLabel>
                  <Input
                    error={values.passwordError}
                    id="passwordValidate"
                    type="password"
                    onChange={handleChange('passwordValidate')}
                  />
                </FormControl>
              )
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegister} color="secondary">
            {register ? '返回登陆' : '注册新用户'}
          </Button>
          <Button onClick={handleLoginAndRegister} color="primary" disabled={values.showProgress}>
            {register ? '注册' : '登录'}
          </Button>
        </DialogActions>
        <LinearProgress className={classes.showProgress} />
      </Dialog>

    </div>
  );
}
