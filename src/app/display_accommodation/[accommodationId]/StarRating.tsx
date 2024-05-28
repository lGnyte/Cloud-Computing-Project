import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const handleClick = (index: number) => {
    setRating(index + 1);
  };

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => handleClick(index)}
          className="focus:outline-none"
        >
          <FaStar
            size={24}
            className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
