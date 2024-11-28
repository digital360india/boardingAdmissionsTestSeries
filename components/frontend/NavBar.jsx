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
      <nav className="hidden md:flex justify-between items-center py-5 shadow-lg bg-white text-white relative">
        <div className="absolute top-3 left-8">
          <Link href="/">
            <Image
              src="/navbar.svg"
              alt="Logo"
              className="w-[80px]"
              width={1000}
              height={1000}
            />
          </Link>
        </div>
        <ul className="flex justify-center w-full">
          <Link href="/testPackage">
            <li className="transition-all duration-300 font-bold text-[#5882E6] text-[18px] hover:tracking-widest cursor-pointer">
              Test Packages
            </li>
          </Link>
        </ul>
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
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
