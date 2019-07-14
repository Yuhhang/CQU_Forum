import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SectionEntry from './SectionEntry';

const instance = axios.create({
  baseURL: 'http://server.messi1.top/api/',
  timeout: 5000,
});


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
  const sectionListDump = sectionList.map(section => (
    <SectionEntry
      key={section.section_id}
      sectionId={section.section_id}
      sectionName={section.name}
      mode={section.mode}
      msg={section.msg}
    />
  ));
  return (
    <Grid container>
      {sectionListDump}
    </Grid>

  );
}
