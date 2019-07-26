import { useEffect, useState } from 'react';

const tenSec = 10 * 1000;
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

function timeAgo(current, previous) {
  const elapsed = current - previous;

  if (elapsed < tenSec) {
    return 'just now';
  }

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000).toString().concat('s');
  }

  if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute).toString().concat('m');
  }
  if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour).toString().concat('h');
  }
  if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay).toString().concat('d');
  }
  if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth).toString().concat(' month ago');
  }
  return Math.round(elapsed / msPerYear).toString().concat(' years ago');
}


export default function RelativeTime(props) {
  const { postTime } = props;
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const ticker = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000 * 60);
    return () => clearInterval(ticker);
  });

  return timeAgo(currentTime, postTime);
}
