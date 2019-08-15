import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import userContext from '../../../context/userContext';
import ChangeNickNameDialog from './ChangeNickNameDialog';
import ChangePswdDialog from './ChangePswdDialog';
import VerifyDialog from './VerifyDialog';


const useStyles = makeStyles(theme => ({
  paper: {
    margin: 'auto',
    maxWidth: '600px',
    padding: theme.spacing(3, 2),
  },
}));

export default function FullWidthTabs() {
  const context = useContext(userContext);

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h3">
          账号信息
        </Typography>
        <MenuList>
          <ChangeNickNameDialog />
          <Divider />
          <ChangePswdDialog />
          <Divider />
          <VerifyDialog />
          <Divider />
          <MenuItem disabled>申请管理员</MenuItem>
          <Divider />
        </MenuList>
      </Paper>
    </div>
  );
}
