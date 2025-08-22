import React from "react";
import comingSoonImg from "../../assets/images/commingSoon/commingSoon.png";

const CommngSoonComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-0">
      <img
        src={comingSoonImg}
        alt="Coming Soon"
        className="max-w-xs w-full mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-700">Coming Soon...</h2>
    </div>
  );
};

export default CommngSoonComponent;
