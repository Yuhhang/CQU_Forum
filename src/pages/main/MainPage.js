import React from 'react';
import Section from './section'

function MainPage() {
    const numbers = [1,2,3,4,5,6,7,8,9,10];
    const sectionLists = numbers.map((number) => 
        <Section key={number.toString()} />
    );
    return (
        <div>
            {sectionLists}
        </div>
    )
}

export default MainPage;