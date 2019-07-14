import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
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
    padding: '10px 0px 0px 10px',
  },
  subTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
  },
}));

export default function CenteredGrid(props) {
  const {
    sectionId,
    sectionName,
    mode,
    msg,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={6}>
      <Link to={'/section/'.concat(sectionId)} style={{ textDecoration: 'none' }}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h6" component="h2" color="textPrimary" noWrap>
              {sectionName}
              <Typography variant="body2" component="span" color="textSecondary">
              (今日:0x01)
              </Typography>
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary" noWrap>
              {msg || '暂无介绍'}
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
