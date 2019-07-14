import { green, red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import React, { useContext } from 'react';
import userContext from '../context/userContext';

function switchTypeColor(type) {
  switch (type) {
    case 'error':
      return red[600];
    case 'success':
      return green[600];
    default:
      return green[600];
  }
}

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
}));

export default function SimpleSnackbar() {
  const context = useContext(userContext); // global user context
  const { userState } = context;

  const classes = useStyles();
  // const [open, setOpen] = React.useState(userState.openMsgBar);

  // function handleClick() {
  //   setOpen(true);
  // }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    context.setunShowMsgBar(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={userState.openMsgBar}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
      >
        <SnackbarContent
          style={{ backgroundColor: switchTypeColor(userState.msgBarType) }}
          message={<span id="message-id">{userState.msgBarText}</span>}
          action={[
            // <Button key="undo" color="secondary" size="small" onClick={handleClose}>
            //   UNDO
            // </Button>,
            <IconButton
              key="close"
              color="inherit"
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
}
