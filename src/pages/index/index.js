import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import TimelineLatest from './timelineLatest';
import TimelineHot from './timelineHot';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: 'auto',
    maxWidth: '500px',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(parseInt(sessionStorage.getItem('currentIndexItem'), 10) || 0);

  function handleChange(event, newValue) {
    sessionStorage.setItem('currentIndexItem', newValue);
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="default"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="最新发帖" {...a11yProps(0)} />
          <Tab label="近期热门" {...a11yProps(1)} />
          <Tab disabled label="更多" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TimelineLatest />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TimelineHot />
      </TabPanel>
      <TabPanel value={value} index={2}>
        ......
      </TabPanel>
    </div>
  );
}
