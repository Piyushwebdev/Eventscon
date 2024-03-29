import React from "react";
import success from "../assets/success.png";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="text-green-600 text-5xl">Payment successful</h2>
      <h6 className="text-yellow-600 text-center mt-8 text-2xl font-bold">
        Your order is in our system
      </h6>
      <div className="flex justify-end items-center mx-auto my-24 w-60">
        <img src={success} alt="" style={{ width: "100px", height: "100px" }} />
      </div>
      <div className="my-10 mx-auto">
        <Link to="/home" className="underline text-xl underline-offset-4">
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Success;
