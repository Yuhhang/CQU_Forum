import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Switch from '@material-ui/core/Switch';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import userContext from '../context/userContext';

const titleMaxLength = 20;
const contentMaxLength = 1000;

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
  {
    value: 'EUR1',
    label: '€1',
  },
  {
    value: 'BTC1',
    label: '฿1',
  },
  {
    value: 'JPY1',
    label: '¥1',
  },
];
export default function FormDialog() {
  const context = useContext(userContext); // global user context
  const { setClosePostDialog } = context;
  const { userState } = context;

  const [values, setValues] = React.useState({
    title: '',
    content: '',
    section: '',
  });
  const [titleErr, setTitleErr] = React.useState(false);
  const [contentErr, setContentErr] = React.useState(false);

  const validateInput = (type) => {
    switch (type) {
      case 'title':
        if (values.title.length > titleMaxLength) {
          return false;
        }
        return true;
      case 'content':
        if (values.content.length > contentMaxLength) {
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleChange = prop => (event) => {
    switch (prop) {
      case 'title':
        if (!validateInput('title') && !titleErr) {
          setTitleErr(true);
        } else if (validateInput('title') && titleErr) {
          setTitleErr(false);
        }
        break;
      case 'content':
        if (!validateInput('content') && !contentErr) {
          setContentErr(true);
        } else if (validateInput('content') && contentErr) {
          setContentErr(false);
        }
        break;
      default:
        break;
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  function handleClose() {
    setClosePostDialog();
  }

  return (
    <div>
      <Dialog
        open={userState.openPostDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        scroll="body"
      >
        <DialogTitle id="form-dialog-title">发帖</DialogTitle>
        <DialogContent>
          <TextField
            error={titleErr}
            id="title"
            label="标题"
            type="text"
            margin="normal"
            variant="filled"
            value={values.title}
            onChange={handleChange('title')}
            fullWidth
            helperText={`${values.title.length}/${titleMaxLength}`}
          />
          <TextField
            error={contentErr}
            id="content"
            label="内容"
            type="text"
            name="content"
            multiline
            fullWidth
            rows="3"
            rowsMax="25"
            value={values.content}
            onChange={handleChange('content')}
            margin="normal"
            variant="filled"
            helperText={`${values.content.length}/${contentMaxLength}`}
          />
          <TextField
            id="section"
            select
            label="分区"
            value={values.section}
            onChange={handleChange('section')}
            helperText="请选择一个发帖分区"
            margin="dense"
            variant="filled"
            fullWidth
          >
            {currencies.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={(
              <Switch
                // checked
                // onChange={ (e) => {console.log(e.currentTarget)}}
                color="primary"
              />
            )}
            label="开启匿名"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            取消
          </Button>
          <Button onClick={handleClose} color="primary">
            发布
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
