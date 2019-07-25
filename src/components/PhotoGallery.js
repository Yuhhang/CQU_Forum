import React, { useState, useEffect } from 'react';
import { PhotoSwipe } from 'react-photoswipe';
import probe from 'probe-image-size';
import 'react-photoswipe/lib/photoswipe.css';

export default function Gallery({ imgs, handleClose, index }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const urlPromises = imgs.map(img => probe(img.url));
    Promise.all(urlPromises)
      .then((res) => {
        const datas = res.map(data => ({
          src: data.url,
          w: data.width,
          h: data.height,
        }));
        setItems(datas);
      })
      .catch(() => {

      });
  }, []);

  const options = {
    index,
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <div>
      {items && (
        <PhotoSwipe isOpen items={items} options={options} onClose={handleClose} />
      )}
    </div>
  );
}
