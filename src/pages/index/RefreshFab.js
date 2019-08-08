import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Fab
        disabled={loading}
        color="primary"
        className={classes.fab}
        onClick={() => {
          setLoading(true);
          fetchNewData();
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }}
      >
        <RefreshIcon />
      </Fab>
    </div>
  );
}
