import axios from 'axios';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
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
  // withCredentials: true,
});


export default function LoginDialog() {
  const [values, setValues] = React.useState({
    openLogin: false,
    username: '',
    password: '',
    showPassword: false,
    passwordError: false,
    passwordErrorText: '',
    usernameError: false,
    usernameErrorText: '',
    showProgress: false,
  });
  // const [open, setOpen] = React.useState(false);

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
    // setOpen(true);
    setValues({ ...values, openLogin: true });
  }

  function handleClose() {
    // setOpen(false);
    setValues({ ...values, openLogin: false });
  }

  function handleLogin() {
    if (values.username === '') {
      setValues({ ...values, usernameError: true, usernameErrorText: '请填写用户名' });
      return;
    }
    if (values.password === '') {
      setValues({ ...values, passwordError: true, passwordErrorText: '请填写密码' });
      return;
    }
    // 取消密码错误
    if (values.passwordError === true) {
      setValues({ ...values, passwordError: false });
    }
    // 显示加载条并禁用提交
    setValues({ ...values, showProgress: true });

    instance.post('login/', {
      username: values.username,
      pswd: values.password,
    })
      .then((res) => {
        // handle success
        console.log(res.data);
        if (res.data.login_status === 'success') {
          setValues({ ...values, showProgress: false, openLogin: false });
          // setOpen(false);
        } else {
          setValues({
            ...values, passwordError: true, showProgress: false, password: '',
          });
          // if (res.data.errcode == '403') {

          // }
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
        setValues({
          ...values, passwordError: true, showProgress: false, passwordErrorText: '网络错误',
        });
      });
  }

  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(prop);
    console.log(event.target.value);
    if (values.username !== '' && values.usernameError === true) {
      console.log('Toogle username');
      setValues({ ...values, usernameError: false });
    }
    if (values.password !== '' && values.passwordError === true) {
      setValues({ ...values, passwordError: false });
    }
  };

  // Enter绑定登录
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        登录
      </Button>
      <Dialog
        open={values.openLogin}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyPress={handleKeyPress}
      >
        <DialogTitle id="form-dialog-title">登录</DialogTitle>
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
              <FormHelperText className={classes.showPswdHelperText} error={values.passwordError}>
                {values.passwordErrorText}
              </FormHelperText>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleLogin} color="primary" disabled={values.showProgress}>
            提交
          </Button>
        </DialogActions>
        <LinearProgress className={classes.showProgress} />
      </Dialog>

    </div>
  );
}
