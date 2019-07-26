import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import instance from '../../../components/axios';

const sectionNameMaxLength = 15;
const msgMaxLength = 200;

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function convertToBinary({ visitor, unVerified, verified }) {
  let visitorBin = 0;
  let unVerifiedBin = 0;
  let verifiedBin = 0;
  if (visitor.view) {
    visitorBin += 8;
  }
  if (unVerified.view) {
    unVerifiedBin += 8;
  }
  if (unVerified.post) {
    unVerifiedBin += 4;
  }
  if (unVerified.comment) {
    unVerifiedBin += 2;
  }
  if (verified.view) {
    verifiedBin += 8;
  }
  if (verified.post) {
    verifiedBin += 4;
  }
  if (verified.comment) {
    verifiedBin += 2;
  }
  verifiedBin <<= 8;
  unVerifiedBin <<= 12;
  visitorBin <<= 16;
  return verifiedBin | unVerifiedBin | visitorBin;
}

export default function AddSectionDialog({ disabled }) {
  const [open, setOpen] = React.useState(false);

  const [values, setValues] = React.useState({
    sectionName: '',
    msg: '',
  });
  const [sectionNameErr, setSectionNameErr] = React.useState(false);
  const [msgErr, setMsgErr] = React.useState(false);
  const [showProgress, setShowProgress] = React.useState(false);
  const [visitor, setVisitor] = React.useState({
    view: true,
    post: false,
    comment: false,
  });
  const [unVerified, setunVerified] = React.useState({
    view: true,
    post: false,
    comment: false,
  });
  const [verified, setVerified] = React.useState({
    view: true,
    post: true,
    comment: true,
  });

  const handleChangeVisitor = name => (event) => {
    setVisitor({ ...visitor, [name]: event.target.checked });
  };
  const handleChangeunVerified = name => (event) => {
    setunVerified({ ...unVerified, [name]: event.target.checked });
  };
  const handleChangeVerified = name => (event) => {
    setVerified({ ...verified, [name]: event.target.checked });
  };

  const validateInput = (type) => {
    switch (type) {
      case 'sectionName':
        if (values.sectionName.length > sectionNameMaxLength) {
          return false;
        }
        return true;
      case 'msg':
        if (values.msg.length > msgMaxLength) {
          return false;
        }
        return true;
      default:
        return false;
    }
  };

  const handleChange = prop => (event) => {
    switch (prop) {
      case 'sectionName':
        if (!validateInput('sectionName') && !sectionNameErr) {
          setSectionNameErr(true);
        } else if (validateInput('sectionName') && sectionNameErr) {
          setSectionNameErr(false);
        }
        break;
      case 'msg':
        if (!validateInput('msg') && !msgErr) {
          setMsgErr(true);
        } else if (validateInput('msg') && msgErr) {
          setMsgErr(false);
        }
        break;
      default:
        break;
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  function handleSubmit() {
    setShowProgress(true);
    const url = 'addSection/';
    instance.post(url, {
      name: values.sectionName,
      msg: values.msg,
      mode: convertToBinary({
        visitor,
        unVerified,
        verified,
      }),
    })
      .then((res) => {
        // console.log(res.data);
        if (res.data.login_status === 'success') { // 登陆成功

        }
      })
      .catch(() => {
        // handle error
        setShowProgress(false);
      }).finally(() => {
        setShowProgress(false);
      });
  }

  function handleClose() {
    setOpen(false);
  }

  function FormRow() {
    return (
      <React.Fragment>
        <Grid
          container
          alignItems="center"
          justify="center"
          item
          xs={12}
        >
          <Grid item xs={6}>
            用户类别
          </Grid>
          <Grid item xs={2}>
            <Typography align="center">
              查看
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography align="center">
              发帖
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography align="center">
              评论
            </Typography>
          </Grid>

          <Grid item xs={6}>
            游客
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={visitor.view} onChange={handleChangeVisitor('view')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox disabled checked={visitor.post} onChange={handleChangeVisitor('post')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox disabled checked={visitor.comment} onChange={handleChangeVisitor('comment')} />
          </Grid>

          <Grid item xs={6}>
            未认证用户
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={unVerified.view} onChange={handleChangeunVerified('view')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={unVerified.post} onChange={handleChangeunVerified('post')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={unVerified.comment} onChange={handleChangeunVerified('comment')} />
          </Grid>

          <Grid item xs={6}>
            认证用户
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={verified.view} onChange={handleChangeVerified('view')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={verified.post} onChange={handleChangeVerified('post')} />
          </Grid>
          <Grid item xs={2}>
            <Checkbox checked={verified.comment} onChange={handleChangeVerified('comment')} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div>
      <MenuItem
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        增加分区
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        scroll="body"
      >
        <DialogTitle id="form-dialog-sectionName">添加分区</DialogTitle>
        <DialogContent>
          <TextField
            error={sectionNameErr}
            id="sectionName"
            label="分区名称"
            type="text"
            margin="normal"
            variant="filled"
            value={values.sectionName}
            onChange={handleChange('sectionName')}
            fullWidth
            helperText={`${values.sectionName.length}/${sectionNameMaxLength}`}
          />
          <TextField
            error={msgErr}
            id="msg"
            label="描述（选填）"
            type="text"
            margin="normal"
            variant="filled"
            multiline
            rows={2}
            rowsMax={10}
            value={values.msg}
            onChange={handleChange('msg')}
            fullWidth
            helperText={`${values.msg.length}/${msgMaxLength}`}
          />
          <FormControl component="fieldset">
            <Typography variant="h6">
              权限设置
            </Typography>
            <FormRow />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button
            disabled={showProgress}
            onClick={handleSubmit}
            color="primary"
          >
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
