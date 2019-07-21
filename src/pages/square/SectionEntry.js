import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
// import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import React from 'react';
import { Link } from 'react-router-dom';
import RelativeTime from '../../components/RelativeTime';

const useStyles = makeStyles(() => ({
  card: {
    margin: '5px',
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
          username = item.userName;
        }
      }
    });
  }
  return (
  // <Slide direction="up" in mountOnEnter unmountOnExit>
    <Grid item xs={6}>
      <Link to={'/section/'.concat(sectionId)} style={{ textDecoration: 'none' }}>
        <Card className={classes.card}>
          <ButtonBase className={classes.cardContentButton}>
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
                  <AlternateEmailIcon fontSize="small" />
                  {username || '无'}
                  {username && ' • '}
                  {username
                  && (
                    <RelativeTime postTime={`${postTimeTemp}000`} />
                  )}
                </div>
              </Typography>
            </CardContent>
          </ButtonBase>
        </Card>
      </Link>
    </Grid>
  // </Slide>
  );
}
