import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import userContext from '../../../context/userContext';
import AddSectionDialog from './AddSectionDialog';


const useStyles = makeStyles(theme => ({
  paper: {
    margin: 'auto',
    maxWidth: '600px',
    padding: theme.spacing(3, 2),
  },
}));

export default function FullWidthTabs() {
  const context = useContext(userContext);
  const { userState } = context;
  const { auth } = userState;

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h3">
          后台管理
        </Typography>
        <MenuList>
          <AddSectionDialog disabled={auth.mode !== 'superAdmin'} />
          <Divider />
          <MenuItem disabled>查看删帖</MenuItem>
          <Divider />
          <MenuItem disabled>查看封禁</MenuItem>
          <Divider />
        </MenuList>
      </Paper>
    </div>
  );
}
