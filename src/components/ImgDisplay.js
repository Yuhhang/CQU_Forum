import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const cdnUrl = 'http://mzh.messi1.top/';
const folderPath = 'postImg/';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  img: {
    width: '100%',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

export default function ImgDisplay({ postId, imgNum }) {
  const classes = useStyles();
  if (imgNum === 0) {
    return null;
  }
  const imgs = [];
  for (let i = 0; i < imgNum; i++) {
    imgs.push({
      url: `${cdnUrl}${folderPath}${postId}_${i}`,
      alt: `${postId}_${i}`,
    });
  }
  // const imgNum = imgs.length % 3;
  let imgGrid = null;
  switch (imgs.length) {
    case 1: // 1 imgs
      imgGrid = imgs.map(img => (
        <Grid item xs={12} key={img.alt}>
          <img src={img.url} alt={img.alt} className={classes.img} />
        </Grid>
      ));
      break;
    case 2: // 2 imgs
      imgGrid = imgs.map(img => (
        <Grid item xs={6} key={img.alt}>
          <img src={img.url} alt={img.alt} className={classes.img} />
        </Grid>
      ));
      break;
    default:
      imgGrid = imgs.map(img => (
        <Grid item xs={4} key={img.alt}>
          <img src={img.url} alt={img.alt} className={classes.img} />
        </Grid>
      ));
      break;
  }

  return (
    <Grid container spacing={1}>
      {imgGrid}
    </Grid>
  );
}
