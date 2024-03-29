import React from "react";
import cancel from "../assets/cancel.png";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="text-red-600 text-5xl">Something went wrong!!</h2>
      <h6 className="text-red-400 text-center mt-8 text-2xl font-bold">
        Please retry after sometime
      </h6>
      <div className="flex justify-end items-center mx-auto my-12 w-96">
        <img src={cancel} alt="" style={{ width: "100px", height: "100px" }} />
      </div>
      <div className="my-10 mx-auto">
        <Link to="/home" className="underline tex-xl underline-offset-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
