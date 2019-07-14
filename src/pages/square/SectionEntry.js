import Card from '@material-ui/core/Card';
import { Link, Redirect } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import React from 'react';
import RelativeTime from '../../components/RelativeTime';

const useStyles = makeStyles(() => ({
  card: {
    margin: '5px',
  },
  cardContent: {
    padding: '10px 0px 0px 10px',
  },
  subTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();

  return (
    <Grid item xs={6}>
      <Link to="/section/123" style={{ textDecoration: 'none' }}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="h2" color="textPrimary" noWrap>
              分区名称
              <Typography variant="body2" component="span" color="textSecondary">
              (今日:51)
              </Typography>
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary" noWrap>
              最新发帖最新发帖最新发帖最新发帖最新发帖最新发帖
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              <div className={classes.subTitle}>
                <AlternateEmailIcon fontSize="small" />
                  username•
                <RelativeTime postTime={Date.now()} />
              </div>
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
