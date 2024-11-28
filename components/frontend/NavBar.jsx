"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = ({ scrollToTestPackages, logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShowBackdrop(true);
    } else {
      document.body.style.overflow = "auto";
      setTimeout(() => setShowBackdrop(false), 300);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("backdrop")) {
      closeMenu();
    }
  };

  return (
    <div className="relative">
      {/* Navbar for desktop */}
      <nav className="hidden md:flex justify-between items-center pl-6 py-2 shadow bg-[#5882E6] text-white">
        <Link href="/">
          <Image
            src="/navbar.svg"
            alt="Logo"
            className="w-[80px]"
            width={1000}
            height={1000}
          />
        </Link>
        <ul className="flex space-x-12">
          <Link href="/testPackage">
            <li
              // onClick={scrollToTestPackages}
              className="transition-all duration-300 font-semibold hover:text-gray-200 text-[18px] hover:tracking-widest cursor-pointer"
            >
              Test Packages
            </li>
          </Link>
          <Link href="/contactus">
            <li className="transition-all duration-300 font-semibold hover:text-gray-200 hover:tracking-widest cursor-pointer">
              Contact Us
            </li>
          </Link>
        </ul>
        <div className="pr-4">
          <Link href="/login">
            <div className="bg-white text-[#5882E6] py-2 px-4 rounded-xl hover:text-gray-100 hover:bg-green-400">
              Login
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center px-4 bg-white shadow">
        <button onClick={toggleMenu} className="text-2xl">
          ☰
        </button>
        <Link href="/">
          <Image
            src="./Ace.svg"
            alt="Logo"
            className="w-[130px]"
            width={1000}
            height={1000}
          />
        </Link>
      </div>

      {/* Backdrop with transition */}
      {showBackdrop && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          } backdrop bg-black bg-opacity-50`}
          onClick={handleClickOutside}
        />
      )}

      {/* Side Navbar with transition */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-2/4 max-w-[200px] p-4 bg-white shadow-lg transition-transform duration-500 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <Image
            src="./Ace.svg"
            alt="Logo"
            className="w-[100px]"
            width={1000}
            height={1000}
          />
          {/* Close icon (cross) */}
          <button onClick={closeMenu} className="text-2xl">
            ✕
          </button>
        </div>
        <ul className="flex flex-col space-y-4">
          <li>
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li onClick={scrollToTestPackages}>
            <div>Test Packages</div>
          </li>
          <li>
            <Link href="/contactus" onClick={closeMenu}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
