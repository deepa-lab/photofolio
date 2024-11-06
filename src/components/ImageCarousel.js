import React, { useState } from 'react';
import styles from './ImageCarousel.module.css';

const ImageCarousel = ({ images, index, setShowCarousel }) => {
  const [imageIndex, setImageIndex] = useState(index);

  function previousSlide() {
    const lastIndex = images.length - 1;
    const newIdx = imageIndex === 0 ? lastIndex : imageIndex - 1;
    setImageIndex(newIdx);
  }

  function nextSlide() {
    const lastIndex = images.length - 1;
    const newIdx = imageIndex === lastIndex ? 0 : imageIndex + 1;
    setImageIndex(newIdx);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.imageContainer}>
        <button className={styles.buttons} onClick={previousSlide}>
          &lt;
        </button>
        <img
          src={images[imageIndex]?.url}
          alt={images[imageIndex]?.title}
          className={styles.image}
        />
        <button className={styles.buttons} onClick={nextSlide}>
          &gt;
        </button>
      </div>
      <button className={styles.close} onClick={() => setShowCarousel(false)}>
        x
      </button>
    </div>
  );
};

export default ImageCarousel;
