'use client';
import { UserContext } from '@/lib/context';
import { db } from '@/lib/firebase';
import { doc, getDoc, DocumentData, setDoc } from 'firebase/firestore';
import { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import Accommodation from './Accommodation';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import Reviews from './Reviews';
import AuthCheck from '@/components/AuthCheck';

interface DisplayAccommodationProps {
  params: {
    accommodationId: string;
  };
}

const DisplayAccommodation: NextPage<DisplayAccommodationProps> = ({ params }) => {
  const [accommodation, setAccommodation] = useState({} as DocumentData);
  const [receivedData, setData] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const currentDate = new Date();
  const { user } = useContext(UserContext);


  const handleAddToCart = async () => {
    if (checkInDate == null) {
      toast.error("The checkin date cannot be null!");
      return;
    }
    if (checkOutDate == null) {
      toast.error("The checkout date cannot be null!");
      return;
    }
    try {
      const userCartReference = doc(db, 'cart', user.uid);
      const document = await getDoc(userCartReference);
      if (document.exists()) {
        const documentData = document.data();
        documentData.cart.push({
          checkIn: checkInDate?.toJSON(),
          checkOut: checkOutDate?.toJSON(),
          accommodationId: params.accommodationId,
        })
        await setDoc(userCartReference, documentData);
      } else {
        const documentData = {
          cart: [{
          checkIn: checkInDate?.toJSON(),
          checkOut: checkOutDate?.toJSON(),
          accommodationId: params.accommodationId,
          }]
        } 
        await setDoc(userCartReference, documentData);
      }
      toast.success("Successfully added to cart!");
    } catch (e) {
      toast.error("Could not add to cart! Error: "+e)
    }
  }

  useEffect(() => {
    (async () => { 
      const accommodationRef = await getDoc(doc(db, "accommodations", params.accommodationId));
      if (accommodationRef.exists()) {
        const accommodationData = accommodationRef.data();
        setAccommodation(accommodationData);
        setData(true);
      }
    })();
  }, [receivedData, params.accommodationId]);

  return (
    <AuthCheck usertype='guest'>
    <div className="max-w-4xl mx-auto p-5 flex flex-col">
      <Accommodation accommodation={accommodation} accommodationId={params.accommodationId} />
      <div className="flex space-x-12 mt-4 pb-10 px-10" >
        <div className="flex-1">
          <label className="block mb-3 text-sm font-medium text-gray-700">Check-in Date:</label>
          <DatePicker 
            selected={checkInDate}
            onChange={(date) => { setCheckInDate(date); if(checkOutDate && date && date > checkOutDate) {setCheckOutDate(null);}}}
            selectsStart
            minDate={currentDate}
            startDate={checkInDate}
            endDate={checkOutDate}
            className="border-2"
            shouldCloseOnSelect={true}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-700">Check-out Date:</label>
          <DatePicker 
            className="border-2"
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate}
            shouldCloseOnSelect={true}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddToCart}>
         Add to Cart
      </button>
      <AuthCheck usertype="guest" loadingMessage="You need to login to view the reviews..." notAllowedMessage="You need to login to view the reviews...">
        <Reviews accommodationId={params.accommodationId} />
      </AuthCheck>
    </div>
    </AuthCheck>
  );

};

export default DisplayAccommodation;
