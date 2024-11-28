"use client";
import { UserContext } from "@/providers/userProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "@/firebase/firebase"; 
import showError from "@/utils/functions/showError";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const subscriptionPlans = [
  {
    tier: "Tier 1",
    price: "8",
    features: {
      "Test Screen": true,
      "Result Screen": true,
      Analytics: false,
      "Admin Test Packages": true,
      "Manual Student ID Creation": true,
      "Payment Integration": false,
      "Storage for Future": true,
      "AI integration": false,
      MCQ: true,
      "Multiple Correct Questions": false,
      "Numerical Value Questions": true,
      "Live Test Section": false,
      "Admin Leads": false,
      Homepage: true,
      "Inner Pages (+2)": false,
      "Homepage Editing": false,
      "Storage 1GB": true,
      "Domain Attachment": false,
      "Server Type : Free": true,
      "Image Uploads : 400 (1 Mb each)": true,
    },
  },
  {
    tier: "Tier 2",
    price: "1",
    features: {
      "Test Screen": true,
      "Result Screen": true,
      Analytics: true,
      "Admin Test Packages": true,
      "Manual Student ID Creation": true,
      "Payment Integration": true,
      "Storage for Future": true,
      "AI integration": false,
      MCQ: true,
      "Multiple Correct Questions": true,
      "Numerical Value Questions": true,
      "Live Test Section": false,
      "Admin Leads": true,
      Homepage: true,
      "Inner Pages (+2)": false,
      "Homepage Editing": false,
      "Storage 3GB": true,
      "Domain Attachment": false,
      "Server Type : Paid": true,
      "Image Uploads : 1000 (1 Mb each)": true,
    },
  },
  {
    tier: "Tier 3",
    price: "1",
    features: {
      "Test Screen": true,
      "Result Screen": true,
      Analytics: true,
      "Admin Test Packages": true,
      "Manual Student ID Creation": true,
      "Payment Integration": true,
      "Storage for Future": true,
      "AI integration": true,
      MCQ: true,
      "Multiple Correct Questions": true,
      "Numerical Value Questions": true,
      "Live Test Section": true,
      "Admin Leads": true,
      Homepage: true,
      "Inner Pages (+2)": true,
      "Homepage Editing": true,
      Storage: true,
      "Domain Attachment": true,
      "Server Type : Paid": true,
      "Image Uploads : 2000 (1 Mb each)": true,
    },
  },
];

const SubscriptionPage = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    console.log("Loading Razorpay script...");
    const res = await loadRazorpayScript();
    console.log("Loaded Razorpay script...");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    console.log("Creating order with plan:", plan);
    const orderData = await fetch(
      "https://appinfologicpaymentserver.onrender.com/api/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.price * 100,
          subscriptionType: plan.tier,
        }),
      }
    ).then((t) => {
      console.log("Response from order creation:", t);
      return t.json();
    });

    console.log("Order data received:", orderData);

    if (!orderData || !orderData.id) {
      alert("Failed to create Razorpay order. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: "INR",
      name: "Your Company Name",
      description: `Subscription for ${plan.tier}`,
      order_id: orderData.id,
      handler: async function (response) {
        console.log("Payment response received:", response);
        const paymentDetails = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const subscriptionData = {
          package: plan.tier, // e.g., "Tier 1"
          price: plan.price, // e.g., "8"
          subscriptionStartTime: new Date(), // current date for subscription start
          subscriptionEndTime: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          transactionID: paymentDetails.razorpayPaymentId, // Use Razorpay payment ID as transaction ID
        };

        console.log("Preparing to update subscription for user:", user.id);
        try {
          const userId = user.id; 
          const userRef = doc(db, "users", userId); // Ensure you are using `db`
          const userDoc = await getDoc(userRef);
          
          console.log("User document data:", userDoc.data()); // Log user data for debugging
      
          if (userDoc.exists()) {
              const isOwner = userDoc.data().isOwner; // Ensure this property exists
      console.log(isOwner)
              if (isOwner) {
                  const subscriptionData = {
                      package: plan.tier,
                      price: plan.price,
                      subscriptionStartTime: new Date(),
                      subscriptionEndTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                      transactionID: paymentDetails.razorpayPaymentId,
                  };
      
                  await setDoc(userRef, { subscription: subscriptionData }, { merge: true });
                  console.log("Subscription updated successfully:", subscriptionData);
      
                  router.push({
                      pathname: "/payment-complete",
                      query: {
                          subscriptionType: plan.tier,
                          paymentId: response.razorpay_payment_id,
                      },
                  });
              } else {
                  console.error("User is not an owner.");
                  toast.error("User is not an owner.");
              }
          } else {
              console.error("User document does not exist.");
              toast.error("User document does not exist.");
          }
      } catch (error) {
          console.error("Error updating subscription:", error);
          showError(error.message);
          toast.error("Failed to update subscription. Please try again.");
      }
      
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
  <>
    <ToastContainer />
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Subscription Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-center mb-4">{plan.tier}</h2>
            <p className="text-center text-xl font-semibold mb-6">
              ₹{plan.price}/month
            </p>

            <ul className="space-y-2">
              {Object.keys(plan.features).map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex justify-between items-center"
                >
                  <span>{feature}</span>
                  {plan.features[feature] ? (
                    <span className="text-green-500 text-xl">✅</span>
                  ) : (
                    <span className="text-red-500 text-xl">❌</span>
                  )}
                </li>
              ))}
            </ul>

            <button
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => handlePayment(plan)}
            >
              Subscribe to {plan.tier}
            </button>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default SubscriptionPage;
