import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    // height: '15vh',
    margin: '10px'
  },
  details: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    OTextOverflow: 'ellipsis',
    // white-space: nowrap;
    // text-overflow: ellipsis;
    width: '70%',
  },
  cover: {
    right: 'px',
    margin: '3px',
    borderRadius: '5px',
    width: 80,
  },
}));

export default function MediaControlCard(props) {
  console.log(props)
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card className={classes.card}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {props.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {props.content}
          </Typography>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        image="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2197897054,3002693319&fm=26&gp=0.jpg"
        title="Live from space album cover"
      />
    </Card>
  );
}