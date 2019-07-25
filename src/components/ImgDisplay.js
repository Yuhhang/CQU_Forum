import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import PhotoGallery from './PhotoGallery';

const cdnUrl = 'http://mzh.messi1.top/';
const folderPath = 'postImg/';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  grid: {
    height: '120px',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

export default function ImgDisplay({ postId, imgNum }) {
  const [index, setIndex] = useState(0);
  const [openPhotoGallery, setOpenPhotoGallery] = useState(false);
  const classes = useStyles();
  if (imgNum === 0 || imgNum === undefined) {
    return null;
  }

  function handleClose() {
    setOpenPhotoGallery(false);
  }
  function handleClickImg(i) {
    setIndex(i);
    setOpenPhotoGallery(true);
  }
  const imgs = [];
  for (let i = 0; i < imgNum; i++) {
    imgs.push({
      url: `${cdnUrl}${folderPath}${postId}_${i}`,
      alt: `${postId}_${i}`,
      index: i,
    });
  }

  // const imgNum = imgs.length % 3;
  let imgGrid = null;
  switch (imgs.length) {
    case 1: // 1 imgs
      imgGrid = imgs.map(img => (
        <Grid item xs={12} key={img.alt}>
          <img
            src={img.url}
            alt={img.alt}
            className={classes.img}
            onClick={() => handleClickImg(img.index)}
          />
        </Grid>
      ));
      break;
    case 2: // 2 imgs
      imgGrid = imgs.map(img => (
        <Grid item xs={6} key={img.alt}>
          <img
            src={img.url}
            alt={img.alt}
            className={classes.img}
            onClick={() => handleClickImg(img.index)}
          />
        </Grid>
      ));
      break;
    default:
      imgGrid = imgs.map(img => (
        <Grid item xs={4} key={img.alt} className={classes.grid}>
          <img
            src={img.url}
            alt={img.alt}
            className={classes.img}
            onClick={() => handleClickImg(img.index)}
          />
        </Grid>
      ));
      break;
  }

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        {imgGrid}
      </Grid>
      {openPhotoGallery && (
        <PhotoGallery imgs={imgs} index={index} handleClose={handleClose} />
      )}
    </React.Fragment>
  );
}
