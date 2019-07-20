import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import VerifyDialog from './VerifyDialog';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: 'auto',
    maxWidth: '600px',
    padding: theme.spacing(3, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}


export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  function StuInfo() {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h3">
          个人信息
        </Typography>
        <Typography component="p">
          帐号状态：未验证
        </Typography>
        <FormControl className={classes.textField}>
          <InputLabel htmlFor="nickName">昵称</InputLabel>
          <Input
            id="nickName"
            // type={values.showPassword ? 'text' : 'password'}
            // value={values.password}
            // onChange={handleChange('password')}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </InputAdornment>
            )}
          />
        </FormControl>
        <TextField
          id="name"
          label="姓名"
          className={classes.textField}
          // value={values.name}
          // onChange={handleChange('name')}
          margin="normal"
        />
        <TextField
          id="stuId"
          label="学号"
          className={classes.textField}
          type="number"
          // value={values.name}
          // onChange={handleChange('name')}
          margin="normal"
        />
      </Paper>
    );
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h3">
          账号信息
        </Typography>
        <MenuList>
          <MenuItem>昵称</MenuItem>
          <Divider />
          <MenuItem>密码</MenuItem>
          <Divider />
          <VerifyDialog />
          <Divider />
          <MenuItem>申请管理员</MenuItem>
          <Divider />
        </MenuList>
      </Paper>
      {/* <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="在校学生" />
          <Tab label="新生" />
          <Tab label="学校教职工" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          <StuInfo />
        </TabContainer>
        <TabContainer dir={theme.direction}>Item Two</TabContainer>
        <TabContainer dir={theme.direction}>Item Three</TabContainer>
      </SwipeableViews> */}
    </div>
  );
}
