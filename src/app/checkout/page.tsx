"use client";
import React, { useContext, useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import Payment from "@/components/Payment";
import AuthCheck from "@/components/AuthCheck";
import { DocumentData, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserContext } from "@/lib/context";
import toast from "react-hot-toast";

const CheckoutPage: React.FC = () => {
  const [tab, setTab] = useState("checkout");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAccommodations, setSelectedAccommodations] = useState([] as DocumentData[]);
  const {user} = useContext(UserContext)

  useEffect(() => {
    (async () => {
      if(!Object.keys(user) || !user.uid){
        return;
      }
      const userCartDoc = await getDoc(doc(db, 'cart', user.uid));
      if (!userCartDoc.exists()) {
        return;
      }

      const cartItems = userCartDoc.data().cart;

      let cartAccommodations = [];
      let cartPrice = 0;
      for(const item of cartItems) {
        const accommodationDoc = await getDoc(doc(db, 'accommodations', item.accommodationId))
        if (!accommodationDoc.exists()) {
          continue;
        }
        cartAccommodations.push({...accommodationDoc.data(), checkIn: item.checkIn, checkOut: item.checkOut, id: accommodationDoc.id})

        const reservationDuration = Math.floor((Date.parse(item.checkOut) - Date.parse(item.checkIn)) / 86400000);
        cartPrice += accommodationDoc.data().price * reservationDuration
      }

      setSelectedAccommodations(cartAccommodations)
      setTotalPrice(computeCartTotal(cartAccommodations))
    })();
  }, [user])

  const computeCartTotal = (accommodations: any[]) => {
    let cartPrice = 0
    for(const acc of accommodations) {
      const reservationDuration = Math.floor((Date.parse(acc.checkOut) - Date.parse(acc.checkIn)) / 86400000);
        cartPrice += acc.price * reservationDuration
    }
    return cartPrice;
  }

  const removeFromCart = async(accId:string) => {
    const accommodationDoc = doc(db, 'cart', user.uid)
    const newAccommodations = selectedAccommodations.filter(acc => {
      if (acc.id === accId) return;
      return {
        accommodationId: acc.id,
        checkIn: acc.checkIn,
        checkut: acc.checkOut
      }
    })
    updateDoc(accommodationDoc, {cart: newAccommodations}).then(() => {
      toast.success("Removed from cart!")
      setSelectedAccommodations(newAccommodations)
      setTotalPrice(computeCartTotal(newAccommodations))
    }).catch(err => {
      toast.error("Error removing from cart")
      console.error(err)
    })
  }

  return (
    <AuthCheck usertype="guest">
      {tab === "checkout" ? 
        <CheckoutForm
          selectedAccommodations={selectedAccommodations}
          totalPrice={totalPrice}
          onPayment={() => setTab("payment")}
          onRemoveFromCart={(id) => removeFromCart(id)}
        />
        : tab === "payment" &&
        <Payment totalPrice={totalPrice} />
      }
    </AuthCheck>
  );
};

export default CheckoutPage;
