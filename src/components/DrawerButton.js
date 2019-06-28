import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
    position: "fixed",
    bottom: '10px',
    right: '10px',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function FloatingActionButtons(props) {
  const classes = useStyles();

  return (
    <div>
      <Fab size="small" onClick={props.onClick} color="primary" aria-label="Add" className={classes.fab}>
        <KeyboardArrowLeft />
      </Fab>
    </div>
  );
}

export default FloatingActionButtons;