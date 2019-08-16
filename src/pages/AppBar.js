import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CreateIcon from '@material-ui/icons/Create';
import ForumIcon from '@material-ui/icons/Forum';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useContext } from 'react';
import LoginDialog from '../components/LoginDialog';
import MsgBar from '../components/MsgBar';
import PostDialog from '../components/PostDialog';
import userContext from '../context/userContext';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    // display: 'none',
    // [theme.breakpoints.up('sm')]: {
    //   display: 'block',
    // },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function MainAppBar(props) {
  const context = useContext(userContext); // global user context
  const { userState } = context;
  const { setOpenPostDialog } = context;

  const { isLoggedIn } = userState;

  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          setOpenPostDialog();
          handleMobileMenuClose();
        }}
        disabled={!isLoggedIn}
      >
        <IconButton color="inherit">
          <CreateIcon />
        </IconButton>
        <p>发帖</p>
      </MenuItem>
      <MenuItem onClick={() => {
        if (!isLoggedIn) { // 未登录
          context.setOpenLoginDialog();
        } else {
          context.setLogout();
          context.setShowMsgBar('success', '成功退出');
        }
        handleMobileMenuClose();
      }}
      >
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <p>{isLoggedIn ? '登出' : '登录'}</p>
      </MenuItem>
    </Menu>
  );

  const backButton = (
    <IconButton onClick={() => {
      userState.backFunction();
      context.setunShowBackButton();
    }}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );

  return (
    <div>
      <MsgBar />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            {userState.showBackButton && backButton}
            {!userState.showBackButton
              && (
                <Typography className={classes.title} variant="h6">
                  <ForumIcon />
                  民主湖[v0.1.4]
                </Typography>
              )
            }
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <MenuItem
                onClick={() => {
                  setOpenPostDialog();
                  handleMobileMenuClose();
                }}
                disabled={!isLoggedIn}
              >
                <IconButton color="inherit">
                  <CreateIcon />
                </IconButton>
                <p>发帖</p>
              </MenuItem>
              <MenuItem onClick={() => {
                if (!isLoggedIn) { // 未登录
                  context.setOpenLoginDialog();
                } else {
                  context.setLogout();
                  context.setShowMsgBar('success', '成功退出');
                }
                handleMobileMenuClose();
              }}
              >
                <IconButton color="inherit">
                  <AccountCircleIcon />
                </IconButton>
                <p>{isLoggedIn ? '登出' : '登录'}</p>
              </MenuItem>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="Show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {renderMobileMenu}
      <PostDialog />
      <LoginDialog />
    </div>
  );
}
