import React, { useContext } from 'react';
import axios from 'axios';
import clsx from 'clsx';
// import { ReCaptcha } from 'react-recaptcha-v3';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LinearProgress from '@material-ui/core/LinearProgress';
import userContext from '../context/userContext';
// import CircularProgress from '@material-ui/core/CircularProgress';


// const siteKey = '6LeBQ6sUAAAAAK30E3NZs_oHm2XtedUkLpRO7MlW';
// loadReCaptcha(siteKey);
// www.recaptcha.net

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});

export default function LoginDialog() {
  const context = useContext(userContext); // global user context
  const { userState } = context;
  const { openLoginDialog } = userState;

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
  const [register, setRegister] = React.useState(false);
  // const [isLoggedIn, setLoggedIn] = React.useState(false);
  // const [captchaLoading, setCaptchaLoading] = React.useState(true);
  // const [captchaToken, setCaptchaToken] = React.useState('');

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
    // captchaLoadText: {
    //   fontSize: 10,
    //   position: 'relative',
    //   bottom: 2,
    // },
  }));

  const classes = useStyles();

  function handleClose() {
    context.setCloseLoginDialog();
  }

  function checkPswdSame() {
    if (values.password !== values.passwordValidate) {
      setValues({ ...values, passwordError: true, passwordErrorText: '两次密码输入不一致' });
      return false;
    }
    return true;
  }

  function handleRegister() {
    setRegister(!register);
  }

  function checkUsername() {
    if (values.username === '') {
      setValues({ ...values, usernameError: true, usernameErrorText: '请填写用户名' });
      return false;
    }
    // 字母开头，允许5-16字节，允许字母数字下划线
    const usernameReg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
    if (register && !usernameReg.test(values.username)) {
      setValues({ ...values, usernameError: true, usernameErrorText: '用户名以字母开头，5-16字节，允许字母数字下划线' });
      return false;
    }
    return true;
  }

  function checkPassword() {
    if (values.password === '') {
      setValues({ ...values, passwordError: true, passwordErrorText: '请填写密码' });
      return false;
    }
    const pswdReg = /^[\s]*$/;
    if (register && (values.password.length < 6 || !pswdReg.test(values.password))) {
      setValues({ ...values, passwordError: true, passwordErrorText: '密码不能包含空格，且不能少于6位' });
      return false;
    }
    return true;
  }

  function handleSubmit() {
    if (!checkUsername()) return;
    if (!checkPassword()) return;

    if (register) {
      if (!checkPswdSame()) return;
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
      // Token: captchaToken,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.login_status === 'success') { // 登陆成功
          setValues({ ...values, showProgress: false });
          context.setCloseLoginDialog();
          // setLoggedIn(true);
          const userInfo = {
            openLoginDialog: false,
            isLoggedIn: true,
            userName: values.username,
            avatar: '',
            auth: {
              mode: 'admin',
              sections: [],
            },
          };
          context.setLogin(userInfo); // 设置全局context
        } else if (res.data.login_status === 'fail') { // 登陆失败
          setValues({
            ...values,
            passwordError: true,
            showProgress: false,
            password: '',
            passwordErrorText: '用户名或密码错误',
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
      }).finally(() => {
        // setCaptchaToken('');
        // setCaptchaLoading(true);
      });
  }

  function canclePswdErr() {
    if (values.passwordError === true) {
      setValues({ ...values, passwordError: false, passwordErrorText: '' });
    }
  }

  function cancleUserErr() {
    if (values.usernameError === true) {
      setValues({ ...values, usernameError: false, usernameErrorText: '' });
    }
  }

  // 输入处理函数
  const handleChange = prop => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  // Enter绑定登录
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // 是否显示密码
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  // function verifyCallback(recaptchaToken) {
  //   // Here you will get the final recaptchaToken!!!
  //   // console.log(recaptchaToken);
  //   setCaptchaToken(recaptchaToken);
  //   setCaptchaLoading(false);
  // }
  return (
    <div>
      {/* <LoginAndOut
        isLoggedIn={isLoggedIn}
        handleClickOpen={handleClickOpen}
        handleLogout={handleLogout}
      /> */}
      <Dialog
        open={openLoginDialog}
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
                onFocus={cancleUserErr}
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
                onFocus={canclePswdErr}
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
          {/* <FormHelperText>
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy"> Privacy Policy </a>
            and
            <a href="https://policies.google.com/terms"> Terms of Service </a>
            apply.
          </FormHelperText>
          <div>
            {captchaLoading
              && (
              <div>
                <CircularProgress size={15} />
                <span className={classes.captchaLoadText}>
                  正在加载验证凭证...
                </span>
              </div>
              )
            }
          </div> */}
        </DialogContent>
        {/* {captchaToken === ''
          && (
            <ReCaptcha
              sitekey={siteKey}
              action="login"
              verifyCallback={verifyCallback}
            />
          )
        } */}
        <DialogActions>
          <Button onClick={handleRegister} color="secondary">
            {register ? '返回登陆' : '注册新用户'}
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={values.showProgress}>
            {register ? '注册' : '登录'}
          </Button>
        </DialogActions>
        <LinearProgress className={classes.showProgress} />
      </Dialog>

    </div>
  );
}
