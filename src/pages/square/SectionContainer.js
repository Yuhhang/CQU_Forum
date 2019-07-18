import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import SectionEntry from './SectionEntry';
import instance from '../../components/axios';

export default function SectionBlock() {
  const [sectionList, setSectionList] = useState(JSON.parse(localStorage.getItem('sectionList')));
  useEffect(() => {
    if (sectionList !== null) {
      return;
    }
    instance.get('/getSections')
      .then((res) => {
        setSectionList(res.data);
        localStorage.setItem('sectionList', JSON.stringify(res.data));
      })
      .catch(() => {
        // handle error

      }).finally(() => {

      });
  }, []);
  let sectionListDump = '暂无数据';
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
    <Grid container>
      {sectionListDump}
    </Grid>

  );
}
