import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import instance from '../../components/axios';
import SectionEntry from './SectionEntry';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    paddingBottom: '56px',
  },
}));
export default function SectionBlock() {
  const classes = useStyles();

  const [sectionList, setSectionList] = useState(JSON.parse(sessionStorage.getItem('sectionList')));
  useEffect(() => {
    if (sectionList !== null) {
      return;
    }
    instance.get('/getSections')
      .then((res) => {
        setSectionList(res.data);
        sessionStorage.setItem('sectionList', JSON.stringify(res.data));
      })
      .catch(() => {
        // handle error

      }).finally(() => {

      });
  }, []);
  let sectionListDump = null;
  if (sectionList !== null) {
    sectionListDump = sectionList.map(section => (
      <SectionEntry
        key={section.section_id}
        sectionId={section.section_id}
        sectionName={section.name}
        mode={section.mode}
        msg={section.msg}
      />
    ));
  }
  return (
    <Grid container spacing={1} className={classes.root}>
      {sectionListDump || '暂无数据'}
    </Grid>
  );
}
