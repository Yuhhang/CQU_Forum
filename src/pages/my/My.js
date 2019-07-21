import { Container } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'; // Teacher Icon
import ErrorIcon from '@material-ui/icons/Error'; // Not Verified Icon
import FaceIcon from '@material-ui/icons/Face';
import HistoryIcon from '@material-ui/icons/History';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School'; // Verified Icon
import SendIcon from '@material-ui/icons/Send';
import StarsIcon from '@material-ui/icons/Stars';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'; // Admin Icon
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import userContext from '../../context/userContext';


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
    color: '#fff',
    backgroundColor: blue[500],
  },
}));

function LabelInfo(props) {
  const { status } = props;
  const { setOpenLoginDialog } = props;
  let icon = <ErrorIcon />;
  let label = '未登录';
  if (!status || status === 'visitor') { // 点击登录
    return (
      <Chip
        variant="default"
        size="medium"
        icon={icon}
        label={label}
        clickable
        color="primary"
        onClick={setOpenLoginDialog}
      />
    );
  }
  switch (status) {
    case 'unVerified':
      icon = <ErrorIcon />;
      label = '未认证用户';
      break;
    case 'verified':
      icon = <SchoolIcon />;
      label = '认证用户';
      break;
    case 'teacher':
      icon = <AssignmentIndIcon />;
      label = '教师/学校工作人员';
      break;
    case 'admin':
      icon = <VerifiedUserIcon />;
      label = '管理员';
      break;
    case 'superAdmin':
      icon = <VerifiedUserIcon />;
      label = '超级管理员';
      break;
    default:
      break;
  }
  return (
    <Chip
      variant="outlined"
      size="small"
      icon={icon}
      label={label}
      color="primary"
    />
  );
}

export default function My() {
  const context = useContext(userContext);
  const { setOpenLoginDialog } = context;
  const { userState } = context;

  const { isLoggedIn } = userState;
  const classes = useStyles();

  return (
    <Container maxWidth="xs" justify="center">
      <React.Fragment>
        <div>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={4}>
              <Avatar className={classes.avatar}>
                <FaceIcon fontSize="large" />
              </Avatar>
            </Grid>
            <Grid container item xs={8} spacing={1}>
              <Grid item xs={8}>
                <Typography variant="h5">
                  {userState.userName}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <LabelInfo status={userState.auth.mode} setOpenLoginDialog={setOpenLoginDialog} />
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.root}>
          <List component="nav">
            <Divider />
            <ListItem button component={Link} to="/my/userInfo" disabled={!isLoggedIn}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="个人信息" />
            </ListItem>

            <ListItem button disabled={!isLoggedIn}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="浏览历史" />
            </ListItem>

            <ListItem button disabled={!isLoggedIn}>
              <ListItemIcon>
                <StarsIcon />
              </ListItemIcon>
              <ListItemText primary="我的收藏" />
            </ListItem>

            <ListItem button disabled={!isLoggedIn}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="我的发帖" />
            </ListItem>
            <ListItem button disabled={!isLoggedIn}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="我的关注" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="关于" />
            </ListItem>
          </List>
        </div>
      </React.Fragment>
    </Container>
  );
}
