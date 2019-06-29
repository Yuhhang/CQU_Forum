import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AccountIcon from '@material-ui/icons/AccountBox';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People';

import DrawerButton from '../components/DrawerButton';

import MainPage from './main/MainPage';
import FindPage from './find/Find';
import MyPage from './my/My';
import AppBarCustom from './AppBar';


const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
    page: <MainPage />,
  });

  const toggleDrawer = (side, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem button key="主页" onClick={() => { state.page = <MainPage />; }}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="主页" />
        </ListItem>
        <ListItem button key="发现" onClick={() => { state.page = <FindPage />; }}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="发现" />
        </ListItem>
        <ListItem button key="我的" onClick={() => { state.page = <MyPage />; }}>
          <ListItemIcon><AccountIcon /></ListItemIcon>
          <ListItemText primary="我的" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );


  return (
    <React.Fragment>
      <AppBarCustom />
      {state.page}
      <div>
        <DrawerButton onClick={toggleDrawer('right', true)} />
        <SwipeableDrawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer('right', false)}
          onOpen={toggleDrawer('right', true)}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          {sideList('right')}
        </SwipeableDrawer>
      </div>
    </React.Fragment>
  );
}

export default SwipeableTemporaryDrawer;
