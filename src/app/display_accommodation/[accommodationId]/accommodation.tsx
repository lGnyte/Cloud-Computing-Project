import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import React, { useState } from 'react';


const Accommodation: React.FC<DocumentData> = ({ accommodation }) => {
  const { photos, location, title, description, numberOfRooms, price } = accommodation;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = () => {
    if(!photos || photos.length <= 1) {
      return;
    }
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if(!photos || photos.length <= 1) {
      return;
    }
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 className="text-3xl">{title}</h1>
      <p><strong>Location:</strong> {location}</p>
      { photos && photos.length ? 
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Image 
          src={photos[currentPhotoIndex]} 
          alt={`Photo ${currentPhotoIndex + 1}`} 
          width={800} 
          height={600} 
          style={{ borderRadius: '8px' }}
          className="width-[800px] h-[600px]"
        />
        <button 
          onClick={handlePrevPhoto} 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '10px', 
            transform: 'translateY(-50%)', 
            background: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px', 
            borderRadius: '50%', 
            cursor: 'pointer'
          }}>
          ‹
        </button>
        <button 
          onClick={handleNextPhoto} 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            right: '10px', 
            transform: 'translateY(-50%)', 
            background: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px', 
            borderRadius: '50%', 
            cursor: 'pointer'
          }}>
          ›
        </button>
      </div>
      : 
      <div>
        <Image 
          priority
          src={"/no-image.png"} 
          alt={`No images`} 
          width={500} 
          height={500} 
          style={{ borderRadius: '8px' }}
          className='w-[500px] h-[500px]'
        />
      </div>
      }
      <p className="mb-4"><strong>Experience Description:</strong> <br />{description}</p>
      <p><strong>Number of rooms:</strong> {numberOfRooms}</p>
      <p><strong>Price:</strong> {price} lei per night</p>
    </div>
  );
};

export default Accommodation;
