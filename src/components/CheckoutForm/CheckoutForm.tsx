import React from "react";

interface Accommodation {
  description: string;
  location: string;
  numberOfRooms: number;
  photos: string[];
  price: number;
  title: string;
  uid: string;
}

interface CheckoutFormProps {
  selectedAccommodations?: Accommodation[];
  onPayment: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  selectedAccommodations = [],
  onPayment,
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Selected Accommodations
      </h2>
      {selectedAccommodations && selectedAccommodations.length > 0 ? (
        <div className="grid gap-6">
          {selectedAccommodations.map((accommodation) => (
            <div
              key={accommodation.uid}
              className="flex items-center bg-gray-100 p-6 rounded-lg"
            >
              <img
                className="w-24 h-24 object-cover rounded-md mr-6"
                src={accommodation.photos[0]}
                alt={accommodation.title}
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {accommodation.title}
                </h3>
                <p className="text-gray-700 mb-2">
                  {accommodation.description}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Location:</strong> {accommodation.location}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Number of Rooms:</strong>{" "}
                  {accommodation.numberOfRooms}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Price:</strong> ${accommodation.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No accommodations selected.</p>
      )}
      <div className="flex justify-center mt-8">
        <button
          onClick={onPayment}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Go to payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
