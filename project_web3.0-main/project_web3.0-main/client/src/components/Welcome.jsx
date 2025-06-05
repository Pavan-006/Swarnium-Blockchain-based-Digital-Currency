import React from "react";
import { useNavigate } from "react-router-dom";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-2 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-5">
          <h1 className="text-2xl sm:text-4xl text-white text-gradient py-1">
            SWARNIUM <br /> Digital India Initiative
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Experience seamless transactions with SWARNIUM as we take a leap forward towards Digital India
          </p>

          {/* Indian Flag Colored Card */}
          <div className="p-3 justify-end items-start flex-col rounded-xl h-60 sm:w-90 w-full eth-card white-glassmorphism mt-10">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg mt-1">
                  SWARNIUM
                </p>
                <p className="text-white font-light text-sm">
                  Digital Currency of India
                </p>
              </div>
            </div>
          </div>

          {/* Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => navigate('/client-login')}
              className="flex-1 bg-[#2952e3] py-3 px-8 rounded-full cursor-pointer hover:bg-[#2546bd] text-white font-semibold"
            >
              Client Login
            </button>
            <button
              onClick={() => navigate('/gov-login')}
              className="flex-1 border border-[#2952e3] py-3 px-8 rounded-full cursor-pointer hover:bg-[#2952e3] text-white font-semibold"
            >
              Government Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
