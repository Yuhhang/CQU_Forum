/* eslint-disable prefer-destructuring */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { grey, green, teal } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  chip: {
    marginLeft: '10px',
    borderRadius: '3px',
    fontSize: '0.7rem',
  },
}));

export default function UserLabel({ type, text }) {
  const classes = useStyles();
  let bgColor;
  let label;
  switch (type) {
    case 'student':
      bgColor = grey[500];
      label = text || '学生';
      break;
    case 'admin':
      bgColor = green[500];
      label = text || '管理员';
      break;
    case 'teacher':
      bgColor = teal[500];
      label = text || '教职工';
      break;
    default:
      bgColor = grey[600];
      label = text || '未认证用户';
      break;
  }
  return (
    <Chip label={label} style={{ backgroundColor: bgColor }} className={classes.chip} size="small" />
  );
}
