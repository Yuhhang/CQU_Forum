import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
// import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import AtUserNameDotTime from '../../components/gadget/AtUserNameDotTime';


const useStyles = makeStyles(() => ({
  card: {
    margin: 'auto',
    maxWidth: '200px',
  },
  cardContent: {
    padding: '15px 0px 15px 10px',
    width: '100%',
    textAlign: 'left',
  },
  cardContentButton: {
    width: '100%',
  },
  subTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
  },
}));

const currentDayTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;

export default function CenteredGrid(props) {
  const {
    sectionId,
    sectionName,
    mode,
    msg,
  } = props;
  const classes = useStyles();

  let postCount = 0;
  let postTitle = '';
  let username = '';
  let postTimeTemp = currentDayTime;
  const postList = JSON.parse(sessionStorage.getItem('postList'));
  if (postList !== null) {
    postList.forEach((item) => {
      if ((item.sectionId === sectionId) && (item.postTime - currentDayTime > 0)) {
        postCount += 1;
        if (item.postTime > postTimeTemp) {
          postTimeTemp = item.postTime;
          postTitle = item.title;
          username = item.nickName;
        }
      }
    });
  }
  return (
    // <Slide direction="up" in mountOnEnter unmountOnExit>
    <Grid item xs={6} sm={4} lg={3}>
      <Card className={classes.card}>
        <ButtonBase
          className={classes.cardContentButton}
          component={Link}
          to={'/section/'.concat(sectionId)}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="h2" color="textPrimary" noWrap>
              {sectionName}
              <Typography variant="body2" component="span" color="textSecondary">
                (今日:
                {postCount}
                )
              </Typography>
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary" noWrap>
              {postTitle || '暂无新帖'}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              <div className={classes.subTitle}>
                {username ? <AtUserNameDotTime nickName={username} postTime={`${postTimeTemp}000`} /> : '________'}
              </div>
            </Typography>
          </CardContent>
        </ButtonBase>
      </Card>
    </Grid>
    // </Slide>
  );
}
