import React, { useEffect, useState } from 'react';
import instance from '../../components/axios';
import SectionCategory from './SectionCategory';

export default function SectionBlock() {
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
  }, [sectionList]);

  const sectionListSet = {};
  if (sectionList !== null) {
    sectionList.forEach((section) => {
      // console.log(section);
      if (!sectionListSet[section.category_id]) {
        sectionListSet[section.category_id] = [];
      }
      sectionListSet[section.category_id].push(section);
    });
  }
  return (
    <React.Fragment>
      {sectionList
        ? Object.values(sectionListSet).map((set => (
          <SectionCategory
            key={set[0].category_id}
            description={set[0].description}
            sectionList={set}
          />
        )))
        : '暂无数据'}
    </React.Fragment>
  );
}
