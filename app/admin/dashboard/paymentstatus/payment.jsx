import { useSubscription } from '@/providers/subscriptionProvider';
import { useRouter } from 'next/router';

const PaymentComplete = () => {
  const router = useRouter();
  const { subscriptionType, paymentId } = router.query;
  const { subscriptionData } = useSubscription ();
  if (subscriptionData?.isActive == false) {    return router.push("/admin/dashboard/subscriptions");
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Payment Complete</h1>
      <div className="bg-green-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl text-green-700 mb-4 text-center">
          Success! You are now subscribed to {subscriptionType}.
        </h2>
        <p className="text-center text-lg">
          Payment ID: <strong>{paymentId}</strong>
        </p>
        <p className="text-center text-lg">Thank you for your subscription.</p>
      </div>
    </div>
  );
};

export default PaymentComplete;
