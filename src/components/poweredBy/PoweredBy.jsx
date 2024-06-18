import React from "react";

function PoweredBy() {
  return (
    <div className="text-xs italic flex items-center gap-1 bottom-4 absolute font-bold text-gray-500 mb-8">
      Powered By
      <span className="text-primary cursor-pointer underline hover:text-yellow-500">
        Agile
      </span>
      <span>
        <img src="agileLogo.png" height={30} width={30} alt="" />
      </span>
    </div>
  );
}

export default PoweredBy;
