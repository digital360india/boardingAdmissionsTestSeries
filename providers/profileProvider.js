"use client";
import { db } from "@/firebase/firebase";
import { sendOtp } from "@/utils/functions/sendOtp";
import {
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  deleteDoc,
  where,
} from "firebase/firestore";
import { UserCheck } from "lucide-react";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [usersCache, setUsersCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisibleDocs, setLastVisibleDocs] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const fetchTotalUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const totalUsers = snapshot.size;
      setTotalPages(Math.ceil(totalUsers / usersPerPage));
    } catch (err) {
      console.error("Error fetching total users:", err);
      setError("Failed to fetch total users count.");
    }
  };
  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);

    try {
      if (usersCache[page]) {
        console.log(`Page ${page} found in cache.`);
        setLoading(false);
        return usersCache[page];
      }
      let usersQuery = query(
        collection(db, "users"),
        orderBy("displayName"),
        limit(usersPerPage)
      );
      if (page > 1 && lastVisibleDocs[page - 1]) {
        usersQuery = query(usersQuery, startAfter(lastVisibleDocs[page - 1]));
      }
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const newUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersCache((prevCache) => ({
          ...prevCache,
          [page]: newUsers,
        }));
        setLastVisibleDocs((prevDocs) => ({
          ...prevDocs,
          [page]: querySnapshot.docs[querySnapshot.docs.length - 1],
        }));

        setLoading(false);
        return newUsers;
      } else {
        setUsersCache((prevCache) => ({ ...prevCache, [page]: [] }));
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
      setLoading(false);
    }
  };

  console.log(usersCache);

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    const users = await fetchUsers(page);

    if (!users || users.length === 0) {
      toast.info("No more users available on this page.");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);

    try {
      if (!searchTerm.trim()) {
        toast.error("Search term cannot be empty.");
        setLoading(false);
        fetchTotalUsers();
        return;
      }

      const searchQuery = query(
        collection(db, "users"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(searchQuery);

      if (!querySnapshot.empty) {
        const searchResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(searchResults);
        setTotalPages(1);
        setCurrentPage(1);
        return searchResults;
      } else {
        setUsersCache({ search: [] });
        toast.info("No users found with the given name.");
      }
    } catch (err) {
      console.error("Error during search:", err);
      setError("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (profile, newUser) => {
    try {
      const userRef = doc(db, "users", profile.uid);
      await setDoc(userRef, newUser);
      await sendOtp(newUser.name, newUser.email, newUser.verificationCode);
      toast.success("Verification email sent successfully!");
       setUsersCache((prevCache) => {
        const updatedCache = { ...prevCache };
        if (updatedCache[1]) {
          updatedCache[1] = [{ id: profile.uid, ...newUser }, ...updatedCache[1]];
        } else {
          updatedCache[1] = [{ id: profile.uid, ...newUser }];
        }
        return updatedCache;
      });
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const editUser = async (userId, updatedUserData) => {
    try {
      const userRef = doc(db, "users", userId.id);
      await setDoc(userRef, updatedUserData, { merge: true });
  
      setUsersCache((prevCache) => {
        const updatedCache = { ...prevCache };
        
        Object.keys(updatedCache).forEach((page) => {
          updatedCache[page] = updatedCache[page].map((user) =>
            user.id === userId.id ? { ...user, ...updatedUserData } : user
          );
        });
  
        return updatedCache;
      });
  
    } catch (error) {
      console.error("Error editing user:", error);
      toast.error("Failed to edit user. Please try again.");
      throw error;
    }
  };
  

  const handleDelete = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await deleteDoc(userDoc);
      setUsersCache((prevCache) => {
                  const updatedCache = { ...prevCache };
                  Object.keys(updatedCache).forEach((page) => {
                    updatedCache[page] = updatedCache[page].filter(
                      (user) => user.id !== userId
                    );
                  });
                  return updatedCache;
                });
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        error,
        currentPage,
        totalPages,
        usersCache,
        handlePageChange,
        fetchUsers,
        addUser,
        editUser,
        handleDelete,
        handleSearch,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};



// "use client";
// import { db } from "@/firebase/firebase";
// import { sendOtp } from "@/utils/functions/sendOtp";
// import {
//   doc,
//   setDoc,
//   collection,
//   query,
//   orderBy,
//   limit,
//   startAfter,
//   getDocs,
//   deleteDoc,
//   where,
// } from "firebase/firestore";
// import { createContext, useState, useEffect, useMemo, useContext } from "react";
// import { toast } from "react-toastify";
// import { InstituteDataProviderContext } from "./selectedInstituteProvider";
// import axios from "axios";
// import { usePathname } from "next/navigation";
// import { getSecondPathSegment } from "@/utils/functions/getInstituteKey";

// export const ProfileContext = createContext();

// export const ProfileProvider = ({ children }) => {
//   const [usersCache, setUsersCache] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [lastVisibleDocs, setLastVisibleDocs] = useState({});
//   const [totalPages, setTotalPages] = useState(1);
//   const usersPerPage = 10;
//   const pathname = usePathname();
//   const selectedInstituteId = getSecondPathSegment(pathname);
//   const stableInstituteId = useMemo(() => selectedInstituteId, [selectedInstituteId]);

//   const fetchTotalUsers = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "instituteDatabase", `${stableInstituteId}`,"users"));
//       const totalUsers = snapshot.size;
//       setTotalPages(Math.ceil(totalUsers / usersPerPage));
//     } catch (err) {
//       console.error("Error fetching total users:", err);
//       setError("Failed to fetch total users count.");
//     }
//   };
//   useEffect(() => {
//     fetchTotalUsers();
//   }, []);

//   const fetchUsers = async (page) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (usersCache[page]) {
//         setLoading(false);
//         return usersCache[page];
//       }
//       let usersQuery = query(
//         collection(db, "users"),
//         orderBy("name"),
//         limit(usersPerPage)
//       );
//       if (page > 1 && lastVisibleDocs[page - 1]) {
//         usersQuery = query(usersQuery, startAfter(lastVisibleDocs[page - 1]));
//       }
//       const querySnapshot = await getDocs(usersQuery);

//       if (!querySnapshot.empty) {
//         const newUsers = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUsersCache((prevCache) => ({
//           ...prevCache,
//           [page]: newUsers,
//         }));
//         setLastVisibleDocs((prevDocs) => ({
//           ...prevDocs,
//           [page]: querySnapshot.docs[querySnapshot.docs.length - 1],
//         }));

//         setLoading(false);
//         return newUsers;
//       } else {
//         setUsersCache((prevCache) => ({ ...prevCache, [page]: [] }));
//         setLoading(false);
//         return [];
//       }
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError("Failed to fetch users. Please try again.");
//       setLoading(false);
//     }
//   };

//   const handlePageChange = async (page) => {
//     setCurrentPage(page);
//     const users = await fetchUsers(page);

//     if (!users || users.length === 0) {
//       toast.info("No more users available on this page.");
//     }
//   };

//   useEffect(() => {
//     fetchUsers(currentPage);
//   }, [currentPage]);

//   const handleSearch = async (searchTerm) => {
//     setLoading(true);
//     setError(null);
  
//     try {
//       if (!searchTerm.trim()) {
//         toast.error("Search term cannot be empty.");
//         setLoading(false);
//         fetchTotalUsers();
//         return;
//       }
  
//       const searchQuery = query(
//         collection(db, "instituteDatabase", `${stableInstituteId}`, "users"),
//         where("name", ">=", searchTerm),
//         where("name", "<=", searchTerm + "\uf8ff")
//       );
  
//       const querySnapshot = await getDocs(searchQuery);
  
//       if (!querySnapshot.empty) {
//         const searchResults = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
  
//         setUsersCache({ search: searchResults });
//         setTotalPages(1);
//         setCurrentPage(1);
//       } else {
//         setUsersCache({ search: [] });
//         toast.info("No users found with the given name.");
//       }
//     } catch (err) {
//       console.error("Error during search:", err);
//       setError("Failed to perform search. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const addUser = async (profile, newUser) => {
//     try {
//       console.log(profile, newUser, stableInstituteId);
  
//       const userRef = doc(
//         db,
//         "instituteDatabase",
//         `${stableInstituteId}`,
//         "users",
//         profile.uid
//       );
//       await setDoc(userRef, newUser);
//       await sendOtp(newUser.name, newUser.email, newUser.verificationCode);
//       toast.success("Verification email sent successfully!");
  
//       setUsersCache((prevCache) => {
//         const updatedCache = { ...prevCache };
//         if (updatedCache[1]) {
//           updatedCache[1] = [{ id: profile.uid, ...newUser }, ...updatedCache[1]];
//         } else {
//           updatedCache[1] = [{ id: profile.uid, ...newUser }];
//         }
//         return updatedCache;
//       });
//     } catch (error) {
//       console.error("Error adding user:", error);
//       throw error;
//     }
//   };
  
//   const editUser = async (userId, updatedUserData) => {
//     try {
//       const userRef = doc(
//         db,
//         "instituteDatabase",
//         `${stableInstituteId}`,
//         "users",
//         userId.id
//       );
//       await setDoc(userRef, updatedUserData, { merge: true });
  
//       setUsersCache((prevCache) => {
//         const updatedCache = { ...prevCache };
//         Object.keys(updatedCache).forEach((page) => {
//           updatedCache[page] = updatedCache[page].map((user) =>
//             user.id === userId.id ? { ...user, ...updatedUserData } : user
//           );
//         });
//         return updatedCache;
//       });
  
//     } catch (error) {
//       console.error("Error editing user:", error);
//       toast.error("Failed to edit user. Please try again.");
//       throw error;
//     }
//   };
  
  

//   const handleDelete = async (userId) => {
//     try {
//       console.log("Deleting user with ID:", userId);
  
//       const res = await axios.delete(
//         "https://appinfologicpaymentserver.onrender.com/api/payments/deleteUser",
//         {
//           data: { userId, stableInstituteId },
//         }
//       );
  
//       console.log("API response:", res);
  
//       if (res?.data?.message) {
//         setUsersCache((prevCache) => {
//           const updatedCache = { ...prevCache };
//           Object.keys(updatedCache).forEach((page) => {
//             updatedCache[page] = updatedCache[page].filter(
//               (user) => user.id !== userId
//             );
//           });
//           return updatedCache;
//         });
  
//         toast.success("User deleted successfully!");
//       } else {
//         console.warn("API did not return success:", res?.data);
//         toast.error("Failed to delete user. API response was not successful.");
//       }
//     } catch (error) {
//       console.error("Error occurred during deletion:", error);
  
//       if (error.response) {
//         console.error("Response error data:", error.response.data);
//         console.error("Response error status:", error.response.status);
//       } else if (error.request) {
//         console.error("No response received. Request details:", error.request);
//       } else {
//         console.error("Error setting up request:", error.message);
//       }
  
//       toast.error("Failed to delete user. Please try again.");
//     }
//   };
  
  
  
  

//   return (
//     <ProfileContext.Provider
//       value={{
//         loading,
//         error,
//         currentPage,
//         totalPages,
//         usersCache,
//         handlePageChange,
//         fetchUsers,
//         addUser,
//         editUser,
//         handleDelete,
//         handleSearch,
//       }}
//     >
//       {children}
//     </ProfileContext.Provider>
//   );
// };
