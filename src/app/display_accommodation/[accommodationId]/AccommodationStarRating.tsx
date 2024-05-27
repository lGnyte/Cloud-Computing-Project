import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface AccommodationStarRatingProps {
  accommodationId: string
}

const AccommodationStarRating: React.FC<AccommodationStarRatingProps> = ({ accommodationId} ) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    (async () => {
      let reviewsDoc = await getDoc(doc(db, 'reviews', accommodationId));
      if (reviewsDoc.exists()) {
        const data = reviewsDoc.data();
        let average = 0;
        for(let i = 0; i < data.reviews.length; i++) {
          average += data.reviews[i].stars;
        } 
        average /= data.reviews.length;
        setRating(average);
      } else {
        setRating(0);
      }
      setLoading(false);
    })();
  }, [loading]);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          size={24}
          className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

export default AccommodationStarRating;
