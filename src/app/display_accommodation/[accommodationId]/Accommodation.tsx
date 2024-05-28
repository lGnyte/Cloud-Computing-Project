import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';
import React, { useState } from 'react';
import AccommodationStarRating from './AccommodationStarRating';

interface AccommodationProps {
  accommodation: DocumentData,
  accommodationId: string
}


const Accommodation: React.FC<AccommodationProps> = ({ accommodation, accommodationId }) => {
  const { photos, location, title, description, numberOfRooms, price } = accommodation;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 className="text-3xl">{title}</h1>
      <AccommodationStarRating accommodationId={accommodationId} />
      <p><strong>Location:</strong> {location}</p>
      { photos ? 
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Image 
          src={photos[currentPhotoIndex]} 
          alt={`Photo ${currentPhotoIndex + 1}`} 
          width={800} 
          height={600} 
          objectFit="cover"
          style={{ borderRadius: '8px' }}
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
      : null}
      <p className="pb-4">{description}</p>
      <p><strong>Number of rooms:</strong> {numberOfRooms}</p>
      <p><strong>Price:</strong> {price} lei per night</p>
    </div>
  );
};

export default Accommodation;
