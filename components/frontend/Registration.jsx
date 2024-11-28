import React from 'react'

export default function Registration() {
  return (
    <div>
          <div className="xl:px-[100px] lg:px-[40px] px-[24px] mx-auto mb-8">
      <div className="ml-[1%]">
        <p className="text-primary02 font-semibold lg:text-32px text-24px">
          Registration Form
        </p>
        <p className="  lg:text-18px text-14px text-[#8692A6]">
          We are happy to have you here
        </p>
      </div>
      <div className="lg:pt-10 pt-5">
        <p className="text-primary02 font-medium md:text-24px text-18px ml-[1%]">Primary Details</p>
        <div className="lg:flex lg:justify-evenly lg:space-x-12 lg:py-4">
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4  ">
              
              Enter your full name
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Full Name*"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter your Father / Mother Name
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Father / Mother Name*"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter your Phone Number
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Phone Number*"
            />
          </div>
        </div>

        <div className="lg:flex lg:justify-evenly lg:space-x-12 lg:py-4">
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter your email
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Email*"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">DOB</p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="date"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter your City
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="City*"
            />
          </div>
        </div>
      </div>

      <div className='lg:py-0 py-6'>
        <p className="text-primary02 font-medium text-24px lg:ml-3 lg:py-0 py-4 ">
          Educational Details
        </p>
        <div className="lg:flex lg:justify-evenly lg:space-x-12 ">

          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4 ">
              Enter your current Class
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Class*"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter your School Name
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="School name*"
            />
          </div>
          <div>
            <p className="lg:text-16px text-14px font-medium text-[#696F79] py-4">
              Enter target School Name
            </p>
            <input
              className="text-14px bg-[#E6E6E64D] border border-primary02 rounded-md text-[#8692A6] p-4 lg:w-[25vw] w-full h-[54%] font-medium"
              type="text"
              placeholder="Target School Name*"
            />
          </div>
        </div>
      </div>
      <div className="lg:py-20 py-4 pl-[0.5%]">
        <button className="bg-gradient01 lg:text-16px text-14px font-medium text-white lg:w-[28vw] lg:h-[60px] w-full h-[48px] rounded-md">
          Submit
        </button>
      </div>
    </div>
    </div>
  )
}
