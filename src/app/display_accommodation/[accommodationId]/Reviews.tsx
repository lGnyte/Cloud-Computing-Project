import React, { FormEvent, useContext, useEffect, useState } from 'react';
import StarRating from './StarRating';
import { FaStar } from 'react-icons/fa';
import { doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { UserContext } from '@/lib/context';

interface ReviewProps {
  accommodationId: string
}

interface Review {
  stars: number,
  title: string,
  text: string,
  username: string,
}

const Reviews: React.FC<ReviewProps> = ({ accommodationId }) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useContext(UserContext);

  const reloadReviews = async () => {
      const document = await getDoc(doc(db, 'reviews', accommodationId))
      if (document.exists()) {
        const documentData = document.data();
        setReviews(documentData.reviews.reverse());
      } else {
        setReviews([]);
      }
      setLoading(false);
  };

  useEffect(() => {
    reloadReviews();
  }, [loading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newReview = {
        stars: rating,
        title: reviewTitle,
        text: reviewText,
        username: username,
      }
      const reviewsReferenceDoc = doc(db, 'reviews', accommodationId);
      const reviewsCurrentDoc = await getDoc(reviewsReferenceDoc);
      
      if (reviewsCurrentDoc.exists()) {
        const reviewsData = reviewsCurrentDoc.data();
        reviewsData.reviews.push(newReview);
        await setDoc(
          reviewsReferenceDoc, reviewsData 
        );
      } else {
        await setDoc(
          reviewsReferenceDoc, {
            reviews: [newReview]
          } 
        );
      }
      setRating(0);
      setReviewText('');
      setReviewTitle('');
      reloadReviews();
      toast.success("Successfully submited review!");
    } catch (e) {
      toast.error("Could not submit error! Error: "+e);
    }
  };

  return (
      <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Leave a review</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input
            className="w-full p-2 border border-gray-300 rounded mb-5"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Title of your review here..."
            required
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          />
        </div>
        <div className="mb-2">
          <label className="mr-2">Rating:</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
              <h3 className="text-2xl">{review.title}</h3>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={16}
                    className={index < review.stars ? 'text-yellow-500' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">Rating: {review.stars}/5</span>
              </div>
              <h4 className="text-xl mb-5">Author: {review.username}</h4>
              <p>{review.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default Reviews;
