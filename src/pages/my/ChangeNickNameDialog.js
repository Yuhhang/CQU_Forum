import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import instance from '../../components/axios';
import userContext from '../../context/userContext';

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

export default function ChangeNickNameDialog() {
  const context = useContext(userContext);
  const { userState } = context;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [nickName, setNickname] = useState('');
  const [showProgress, setShowProgress] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    setShowProgress(true);
    const url = 'changeNickName/';
    instance.post(url, {
      nickName,
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.status === 'success') {
          context.setShowMsgBar('success', '昵称修改成功');
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
        // handleClose();
      });
  }

  return (
    <div>
      <MenuItem
        onClick={handleClickOpen}
      >
        修改昵称
      </MenuItem>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              昵称
            </Typography>
            <Button
              color="inherit"
              onClick={handleSubmit}
              disabled={showProgress}
            >
              提交
            </Button>
          </Toolbar>
        </AppBar>
        {showProgress
          && <LinearProgress />
        }
        <Paper className={classes.paper}>
          <TextField
            disabled
            id="currentName"
            label="当前昵称"
            className={classes.textField}
            value={userState.userName}
            // onChange={handleChange('name')}
            margin="normal"
          />
          <TextField
            id="stuId"
            label="新昵称"
            className={classes.textField}
            type="number"
            value={nickName}
            onChange={(e) => { setNickname(e.target.value); }}
            margin="normal"
          />
        </Paper>
      </Dialog>
    </div>
  );
}
