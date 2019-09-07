import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Grid from '@material-ui/core/Grid';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SectionCard from './SectionCard';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '800px',
    margin: 'auto',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SectionCategory({ description, sectionList }) {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>{description}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={1} className={classes.root}>
            {sectionList.map(section => (
              <SectionCard
                key={section.section_id}
                sectionId={section.section_id}
                sectionName={section.name}
                mode={section.mode}
                msg={section.msg}
              />
            ))}
            {/* {sectionListDump || '暂无数据'} */}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
