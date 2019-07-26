import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(() => ({
  chip: {
    backgroundColor: '#42a5f5',
    color: '#f5f5f5',
    marginLeft: '10px',
    borderRadius: '3px',
    fontSize: '0.7rem',
  },
}));

export default function UserLabel() {
  const classes = useStyles();

  return (
    <Chip label="超管" className={classes.chip} size="small" />
  );
}
