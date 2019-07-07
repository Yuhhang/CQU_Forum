import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ViewListIcon from '@material-ui/icons/ViewList';
import CategoryIcon from '@material-ui/icons/Category';
import MailIcon from '@material-ui/icons/Mail';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from './AppBar';
import Main from './main/MainPage';
import Inbox from './inbox/inbox';
import My from './my/My';

const useStyles = makeStyles({
  navbar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 100,
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState('index');

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <AppBar />
        <BottomNavigation value={value} onChange={handleChange} className={classes.navbar}>
          <BottomNavigationAction label="主页" value="index" icon={<ViewListIcon />} component={Link} to="/" />
          <BottomNavigationAction label="广场" value="square" icon={<CategoryIcon />} component={Link} to="/square" />
          <BottomNavigationAction label="消息" value="inbox" icon={<MailIcon />} component={Link} to="/inbox" />
          <BottomNavigationAction label="我的" value="my" icon={<AccountCircleIcon />} component={Link} to="/my" />
        </BottomNavigation>

        <Route path="/" exact component={Main} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/my" component={My} />
      </Router>
    </React.Fragment>

  );
}
