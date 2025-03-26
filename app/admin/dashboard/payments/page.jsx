"use client"
import { usePathname } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const PaymentDetail = () => {
  const path = usePathname();
  const segments = path.split('/');
  const id = segments[2]; // URL format: /somePath/{id}/...
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPaymentData(id);
    }
  }, [id]);

  const fetchPaymentData = async (paymentId) => {
    try {
      const docRef = doc(db, 'payments', paymentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPaymentData({ id: docSnap.id, ...docSnap.data() });
        console.log("Fetched data:", docSnap.data());
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrders = async ({ productId, packageName, totalAmount, currency }) => {
    try {
      const response = await axios.post("/api/create-order", {
        productId,
        packageName,
        totalAmount: Number(totalAmount),
        currency,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating orders", error);
      return { error: "Error creating orders" };
    }
  };

  const verifyPayment = async (data) => {
    try {
      const response = await axios.post("/api/verify-payment", data);
      return response.data;
    } catch (error) {
      console.error("Error verifying payment", error);
      return { error: "Error verifying payment" };
    }
  };

  function handleBuy() {
    startTransition(async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        const paymentPrice = Number(paymentData.paymentPrice) || 0;
        const totalAmount = paymentPrice * 1.18; // including 18% GST

        const result = await createOrders({
          productId: id,
          packageName: paymentData.paymentTitle,
          totalAmount,
          currency: "INR",
        });

        if (result.error) {
          alert("Error creating orders");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set in your env
          amount: result.amount,
          currency: "INR",
          name: "Payment Gateway",
          order_id: result.orderId,
          handler: async function (response) {
            const dateOfPurchase = new Date().toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
              timeZoneName: "short",
            });
            const dateOfExpiry = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000)
              .toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
                timeZoneName: "short",
              });
            const paymentObject = {
              email: paymentData.email,
              title: paymentData.paymentTitle,
              phoneNumber: paymentData.phone,
              dateOfPurchase,
              dateOfExpiry,
            };

            const verifyResult = await verifyPayment(response);
            if (verifyResult.error) {
              alert("Payment Failed");
              return;
            }
            alert("Payment Successful");
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    });
  }

  if (loading)
    return <div className="text-center text-2xl mt-10">Loading...</div>;
  if (!paymentData)
    return <div className="text-center text-2xl mt-10">Payment not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Payment Information */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-4xl font-bold mb-6">Payment Information</h2>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Payment Title</p>
            <p className="text-2xl font-semibold">{paymentData.paymentTitle}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Purchaser Name</p>
            <p className="text-2xl font-semibold">{paymentData.name}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Payment Date</p>
            <p className="text-2xl font-semibold">
              {new Date().toLocaleDateString("en-US", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Amount</p>
            <p className="text-2xl font-semibold">₹{paymentData.paymentPrice}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Email</p>
            <p className="text-2xl font-semibold">{paymentData.email}</p>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-600">Phone</p>
            <p className="text-2xl font-semibold">{paymentData.phone}</p>
          </div>
        </div>
        {/* Right side: Payment Action */}
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-6">Proceed with Payment</h2>
            <p className="text-xl mb-6">
              Complete your transaction by clicking the button below to pay via Razorpay.
            </p>
          </div>
          <button
            onClick={handleBuy}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-lg text-2xl font-bold"
          >
            Pay with Razorpay
          </button>
          <div className="mt-4 text-center text-sm text-gray-500">
            Secure Payment Processing via Razorpay.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
