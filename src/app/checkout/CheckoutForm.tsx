import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import React from "react";

interface CheckoutFormProps {
  selectedAccommodations?: DocumentData[];
  onPayment: () => void;
  totalPrice : number
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  selectedAccommodations = [],
  totalPrice,
  onPayment,
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your cart
      </h2>
      {selectedAccommodations && selectedAccommodations.length > 0 ? (
        <div className="grid gap-6">
          {selectedAccommodations.map((accommodation) => (
            <div
              key={accommodation.uid}
              className="flex items-center bg-gray-100 p-6 rounded-lg"
            >
              <Image
                className="w-24 h-24 object-cover rounded-md mr-6"
                width={100}
                height={100}
                src={accommodation.photos.length ? accommodation.photos[0] : "/no-image.png"}
                alt={accommodation.title}
              />
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {accommodation.title}
                </h3>
                <p className="text-gray-700 mb-2">
                  {accommodation.description}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {accommodation.location}
                </p>
                <p className="text-gray-700">
                  <strong>Price:</strong> {accommodation.price} RON
                </p>
                <p>
                  <strong>Check-In Date</strong> {`${new Date(accommodation.checkIn).toLocaleDateString("ro-RO") }`}
                </p>
                <p>
                  <strong>Check-Out Date</strong> {`${new Date(accommodation.checkOut).toLocaleDateString("ro-RO") }`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">You have no accommodations selected.</p>
      )}
      <p className="mt-6 text-xl"><strong>Total amount:</strong> {totalPrice} RON</p>
      <div className="flex justify-center mt-8">
        {selectedAccommodations.length > 0 ?
          <button
            onClick={onPayment}
            className="bg-gray-800 hover:bg-gray-500 duration-200 text-white font-bold py-2 px-6 rounded-md"
          >
            Go to payment
          </button>
          :
          <Link className="bg-gray-800 hover:bg-gray-500 duration-200 text-white font-bold py-2 px-6 rounded-md" href={"/"}>
            Find Experiences
          </Link>
        }
      </div>
    </div>
  );
};

export default CheckoutForm;
