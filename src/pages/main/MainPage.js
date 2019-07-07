import React from 'react';
import Section from '../../components/section';
import Card from '../../components/card';


function MainPage() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sectionLists = numbers.map(number => (
    <Card
      key={number}
      title="Title"
      img="imgUrl"
      content="symbol function guess clear dust shine sets equal largest concerned consider lovely machine cannot fuel bread done common coming wing half tip broad day"
    />
  ));
  return (
    <div>
      {sectionLists}
    </div>
  );
}

export default MainPage;
