"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebaseApp, db } from "@/firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Navbar from "@/components/frontend/NavBar";
import Footer from "@/components/frontend/Footer";
import animationData1 from "@/public/lottie/lottiehello.json";
import animationData2 from "@/public/lottie/lottieman.json";
import Lottie from "lottie-react";
import showError from "@/utils/functions/showError";

const auth = getAuth(firebaseApp);
const secretKey = "qwertyhnbgvfcdxsza";

const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [userRole, setUserRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);
  const handleResetPassword = () => {
    router.push("/resetpassword");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUserByEmail(data.email);
      if (!user) {
        toast.error("Login failed: User not found.");
        setLoading(false);
        return;
      }

      const authUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const encryptedUserId = CryptoJS.AES.encrypt(
        authUser.user.uid,
        secretKey
      ).toString();
      const encryptedUserRole = CryptoJS.AES.encrypt(
        user.role,
        secretKey
      ).toString();

      Cookies.set("userId", encryptedUserId, { expires: 3 });
      Cookies.set("userRole", encryptedUserRole, { expires: 3 });
      if (rememberMe) {
        localStorage.setItem("savedEmail", data.email);
        localStorage.setItem("savedPassword", data.password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }
      setUserRole(user.role);

      toast.success(`Welcome ${user.role.toUpperCase()}!`);
    } catch (error) {
      toast.error("Login failed: " + error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserByEmail = async (email) => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0].data();
    }
    return null;
  };

  useEffect(() => {
    if (userRole) {
      const roleRedirectMap = {
        user: "/user/dashboard",
        admin: "/admin/dashboard",
        teacher: "/teacher/dashboard",
      };
      router.push(roleRedirectMap[userRole] || "/");
    }
  }, [userRole, router]);

  return (
    <>
    <ToastContainer />
      <Navbar />
      <div className="bg-cover bg-gray-100 bg-center bg-no-repeat h-screen w-full">
        <div className="flex justify-center h-[90vh] relative top-10 px-10 overflow-hidden">
          <div className="absolute bg-opacity-20 rounded-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="font-normal text-center p-8 backdrop-blur-lg rounded-lg flex bg-opacity-80 bg-black">
              <div className="w-96 hidden md:block">
                {" "}
                <p className="text-white font-medium mt-16 mb-5 text-4xl">
                  Welcome
                </p>
                <p className="text-white font-medium text-xl">
                  Login to Access Your Dashboard
                </p>
                <Lottie
                  animationData={animationData2}
                  className="h-20 absolute left-52 top-60 "
                />
                <Lottie
                  animationData={animationData1}
                  className="h-84 -mt-14 "
                />
              </div>
              <div className="md:w-96 w-[80vw] h-full  text-black flex-col mt-10 p-8">
                {" "}
                <p className="text-white font-medium  mb-5 text-4xl block md:hidden">
                  Welcome
                </p>
                <p className="text-white font-medium text-xl mb-2 block md:hidden">
                  Login to Access Your Dashboard
                </p>
                <div className="flex justify-center items-center">
                  <img
                    src="https://cdn-icons-png.freepik.com/256/11124/11124805.png?semt=ais_hybrid"
                    alt="Logo"
                    width={1000}
                    height={1000}
                    className="rounded-full h-[100px] w-[100px] shadow-2xl shadow-gray-600"
                  />
                </div>
                <form className="m-auto text-black" onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="text-white justify-start flex text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      name="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setData({ ...data, [e.target.name]: e.target.value })
                      }
                      className="w-full px-3 py-2 placeholder-gray-300 border rounded-md shadow-sm appearance-none focus:outline-none focus:ring focus:border-blue-300 text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-white justify-start flex text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={data.password}
                        name="password"
                        onChange={(e) =>
                          setData({ ...data, [e.target.name]: e.target.value })
                        }
                        className="w-full px-3 py-2 placeholder-gray-300 border rounded-md shadow-sm appearance-none focus:outline-none focus:ring focus:border-blue-300 text-black"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.222a10.477 10.477 0 000 7.556M9.195 12.285a3 3 0 014.61 0m5.815-4.063a10.477 10.477 0 010 7.556m-1.245-3.779a3 3 0 00-3.5 0M3.98 8.222l15.043 7.556M17.463 10.5l-1.236-.619"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.222a10.477 10.477 0 000 7.556M9.195 12.285a3 3 0 014.61 0m5.815-4.063a10.477 10.477 0 010 7.556M3.98 8.222l15.043 7.556M17.463 10.5l-1.236-.619"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center justify-between space-x-3">
                    <div className="flex justify-center items-center gap-0">
                      {" "}
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-white text-sm "
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      className="text-white underline m-2 text-sm"
                      onClick={handleResetPassword}
                    >
                      Reset your password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-12 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <p
                      className="
                 text-white text-lg"
                    >
                      {" "}
                      {loading ? <>Signing in...</> : <>Sign in</>}{" "}
                    </p>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
