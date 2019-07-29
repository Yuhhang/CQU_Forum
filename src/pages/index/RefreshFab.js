import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import React from 'react';

const useStyles = makeStyles(() => ({
  fab: {
    position: 'fixed',
    right: '20px',
    bottom: '60px',
    zIndex: '100',
  },
}));

export default function RefreshFab({ fetchNewData }) {
  const classes = useStyles();

  return (
    <div>
      <Fab
        color="primary"
        className={classes.fab}
        onClick={() => fetchNewData(-1)}
      >
        <RefreshIcon />
      </Fab>
    </div>
  );
}
