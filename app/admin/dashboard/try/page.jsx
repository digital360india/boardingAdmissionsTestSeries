"use client";
import { db } from "@/firebase/firebase";
import { TryContext } from "@/providers/tryProvider";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function page() {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const {createUser , updateUser} = useContext(TryContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (userDetail) {
    //   try {
    //     await updateDoc(doc(db, "messages", userDetail.id), {
    //       name: form.name || userDetail.name,
    //       email: form.email || userDetail.email,
    //       message: form.message || userDetail.message,
    //     });
    //     console.log("Document updated with ID: ");
    //     setForm({ name: "", email: "", message: "" });
    //     alert("Data updated successfully!");
    //     setUserDetail(null);
    //     fetchData();
    //   } catch (error) {
    //     console.error("Error updating document: ", error);
    //     alert("Failed to update data");
    //   }
    // } else {
    //   try {
    //     const docRef = await addDoc(collection(db, "messages"), {
    //       name: form.name,
    //       email: form.email,
    //       message: form.message,
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //     setForm({ name: "", email: "", message: "" });
    //     alert("Data added successfully!");
    //     fetchData();
    //   } catch (error) {
    //     console.error("Error adding document: ", error);
    //     alert("Failed to add data");
    //   }
    // }

    try {
      if (userDetail) {
        await updateUser(userDetail.id, {
          name: form.name || userDetail.name,
          email: form.email || userDetail.email,
          message: form.message || userDetail.message,
        });
        toast.success("User Updated Successfully!");
      } else {
        const docRef = await createUser(form.name, {
          name: form.name,
          email: form.email,
          message: form.message,
        });
        console.log("Document written with ID: ", docRef.id);
        toast.success("User Added Successfully!");
      }
  
      setForm({ name: "", email: "", message: "" });
      fetchData();
    } catch (error) {
      if (userDetail) {
        console.error("Error updating document: ", error);
        toast.error("Failed to update user");
      } else {
        console.error("Error adding document: ", error);
        toast.error("Failed to add user");
      }
    }
  };

  const [userData, setUserData] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setUserDetail(user);
    setForm({
      name: user.name,
      email: user.email,
      message: user.message,
    });
    // setOpen(user.id);
  };

  const router = useRouter();
  const handleViewDetail = (id)=>{
    // router.push(`/admin/dashboard/try/slug?slug=${id}`)  //useSearchParams
    router.push(`/admin/dashboard/try/${id}`)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Contact Us
        </h2>

        <div>
          <label className="block text-gray-600 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-600 font-semibold"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      <div className="grid grid-cols-4 gap-4 ">
        {userData.map((user) => (
          <div key={user.id} className="mb-4 bg-slate-400 p-8">
            <h3>Name = {user.name}</h3>
            <p>Email = {user.email}</p>
            <p>Message = {user.message}</p>
            <div className="py-3 flex justify-between text-center text-white    ">
              <button
              className="bg-green-500 py-2 px-5 rounded-2xl"
                type="button"
                onClick={() => {
                  handleEdit(user);
                }}
              >
                edit
              </button>
              <button className="bg-blue-600 py-2 rounded-2xl px-5" onClick={()=>handleViewDetail(user.id)}>view details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

{
  /* {open == user.id && (
  <FormEdit
    user={user}
    form={form}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    loading={loading}
  />
)} */
}

// const FormEdit = ({ user, form, handleChange, handleSubmit, loading }) => {
//     return (
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-gray-800 text-center">
//           Edit Message
//         </h2>

//         <div>
//           <label className="block text-gray-600 font-semibold" htmlFor="name">
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             id="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-600 font-semibold" htmlFor="email">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
//           />
//         </div>

//         <div>
//           <label
//             className="block text-gray-600 font-semibold"
//             htmlFor="message"
//           >
//             Message
//           </label>
//           <textarea
//             name="message"
//             id="message"
//             value={form.message}
//             onChange={handleChange}
//             rows="4"
//             className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500"
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className={`w-full py-2 px-4 text-white rounded-lg ${
//             loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Sending..." : "Update Message"}
//         </button>
//       </form>
//     );
//   };
