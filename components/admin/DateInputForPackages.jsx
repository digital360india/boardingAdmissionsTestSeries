
import { useState } from "react";
import { Timestamp } from "firebase/firestore"; // Firebase Timestamp

const DateInputDialog = ({ isOpen, onClose, onConfirm }) => {
  const [expirationDate, setExpirationDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleConfirm = () => {
    if (expirationDate && purchaseDate) {
      const dateOfExpiration = Timestamp.fromDate(new Date(expirationDate));
      const dateOfPurchase = Timestamp.fromDate(new Date(purchaseDate));

      onConfirm(dateOfExpiration, dateOfPurchase);
      onClose();
    } else {
      alert("Please enter both dates.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h3 className="text-lg font-semibold">Enter Dates</h3>
        <label>
          Date of Expiration:
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>
        <label>
          Date of Purchase:
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateInputDialog;
