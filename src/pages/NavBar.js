import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import MailIcon from '@material-ui/icons/Mail';
import ViewListIcon from '@material-ui/icons/ViewList';
import { ThemeProvider } from '@material-ui/styles';
import React, { useContext } from 'react';
import {
  HashRouter, Link,
  Route, Switch,
} from 'react-router-dom';
import PostDetail from '../components/PostDetail';
import Section from '../components/Section';
import userContext from '../context/userContext';
import AppBar from './AppBar';
import Inbox from './inbox/inbox';
import Main from './index/index';
import Admin from './my/admin/Admin';
import Collect from './my/Collect';
import My from './my/My';
import MyPosts from './my/MyPosts';
import UserInfo from './my/userInfo/UserInfo';
import Square from './square/Square';

const useStyles = makeStyles({
  navbar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 100,
  },
});


// function SetPath(props) {
//   const { path } = props;
//   const defaultPaths = new Set(['/', '/square', '/inbox', '/my']);
//   if (!defaultPaths.has(path)) {
//     console.log(path)
//     return <Redirect to="/" />;
//   }
//   return null;
// }

export default function LabelBottomNavigation() {
  const context = useContext(userContext);
  const { userState } = context;
  const { darkTheme } = userState;

  const theme = createMuiTheme({
    palette: {
      type: darkTheme ? 'dark' : 'light',
    },
  });
  const classes = useStyles();
  const [value, setValue] = React.useState('index');

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <HashRouter>
          <AppBar />
          {/* <SetPath path={window.location.pathname} /> */}
          <BottomNavigation value={value} onChange={handleChange} className={classes.navbar}>
            <BottomNavigationAction label="主页" value="index" icon={<ViewListIcon />} component={Link} to="/" />
            <BottomNavigationAction label="广场" value="square" icon={<CategoryIcon />} component={Link} to="/square" />
            <BottomNavigationAction label="消息" value="inbox" icon={<MailIcon />} component={Link} to="/inbox" disabled />
            <BottomNavigationAction label="我的" value="my" icon={<AccountCircleIcon />} component={Link} to="/my" />
          </BottomNavigation>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/square" component={Square} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/my" exact component={My} />
            <Route path="/my/collect" component={Collect} />
            <Route path="/my/myposts" component={MyPosts} />
            <Route path="/my/userInfo" component={UserInfo} />
            <Route path="/my/admin" component={Admin} />
            <Route path="/section/:id" component={Section} />
            <Route path="/post/:id" component={PostDetail} />
            {/* No Match */}
            <Route component={Main} />
          </Switch>
        </HashRouter>
      </React.Fragment>
    </ThemeProvider>

  );
}
