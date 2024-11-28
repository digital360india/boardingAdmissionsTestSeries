"use client";
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
export default function page() {
    const path = usePathname();
    
    const id = path.split("/").pop(); // to get the last route value
    
    // const arrayValues = path.split("/"); // to get all the routesa
    // const arrayId = arrayValues[4];
    
    // const searchParams = useSearchParams(); // extract the value from path
    // const idValue = searchParams.get("slug");

    // console.log(idValue);
    // console.log(arrayValues);
    // console.log(arrayId);
    console.log(id);


    const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "messages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError("No such document!");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;







  return (
    <div>
           <h1>User Details</h1>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Message:</strong> {data.message}</p>
    </div>
  )
}
