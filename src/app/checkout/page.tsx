"use client";
import React, { useState } from "react";
import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";

const CheckoutPage: React.FC = () => {
  const [selectedAccommodations, setSelectedAccommodations] = useState([
    {
      description: "Cealalata experienta misto de la noi mare tzeaca",
      location: "Piatra Neamt",
      numberOfRooms: 10,
      photos: [
        "https://firebasestorage.googleapis.com/v0/b/sonorous-zone-419218.appspot.com/o/accommodations%2Fbff30929cdea829e039b9495dd99fcceec7e73880901a475e67b26fb842b69cc.jpg?alt=media&token=db3e8b66-749c-4ba4-b530-ad14e586c3ff",
      ],
      price: 100,
      title: "Alta experienta misto",
      uid: "FhbkbIhB8RbwbjnFB6w0J1lBmjE3",
    },
    {
      description: "Cealalata experienta misto de la noi mare tzeaca",
      location: "Piatra Neamt",
      numberOfRooms: 10,
      photos: [
        "https://firebasestorage.googleapis.com/v0/b/sonorous-zone-419218.appspot.com/o/accommodations%2Fbff30929cdea829e039b9495dd99fcceec7e73880901a475e67b26fb842b69cc.jpg?alt=media&token=db3e8b66-749c-4ba4-b530-ad14e586c3ff",
      ],
      price: 100,
      title: "Alta experienta misto",
      uid: "FhbkbIhB8RbwbjnFB6w0J1lBmjE3",
    },
    // Adauga alte acomodari selectate dupa cum este necesar
  ]);

  const handlePayment = () => {
    console.log("Redirecting to payment page...");

    const totalPrice = selectedAccommodations.reduce(
      (accumulator, accommodation) => {
        return accumulator + accommodation.price;
      },
      0
    );

    // call backend in order to calculate amount
    window.location.href = "/payment";
  };

  return (
    <div>
      <CheckoutForm
        selectedAccommodations={selectedAccommodations}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default CheckoutPage;
