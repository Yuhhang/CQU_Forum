import React from 'react';
import { PhotoSwipe } from 'react-photoswipe';
import 'react-photoswipe/lib/photoswipe.css';


export default function Gallery({ imgs, handleClose, index }) {
  const options = {
    index,
  };
  return (
    <div>
      {imgs && (
        <PhotoSwipe isOpen items={imgs} options={options} onClose={handleClose} />
      )}
    </div>
  );
}
