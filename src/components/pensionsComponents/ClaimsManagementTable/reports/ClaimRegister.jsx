import React from 'react';

const ClaimRegister = ({ headerCols, rowData, contentRef, pdfBlob }) => {
  return (
    <div className="">
      {pdfBlob && (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Page 5 PDF"
        />
      )}{' '}
      <div className="hidden">
        <div ref={contentRef} className="overflow-x-auto ">
          <div className="text-center mx-auto flex flex-col items-center font-sans mb-4">
            <img src="/kenya.png" alt="" height={40} width={60} className="" />
            <h2 className="text-base font-bold">PENSIONS DEPARTMENT</h2>
          </div>
          <div className="flex flex-row gap-2 justify-center text-[18px]  courier-font mb-3">
            <div className="text-gray-700  underline">
              Claims Verification Register Approval For
            </div>{' '}
            {/* <div
              className="text-gray-700  
          "
            >
              RG4
            </div> */}
            <div className="text-gray-700  underline">
              Work Group On Date Of{' '}
            </div>
            <div className="text-gray-700  underline">27-APR-21</div>
            <div className="text-gray-700 ">To</div>
            <div className="text-gray-700 underline">05-MAY-24</div>
          </div>
          <table className="min-w-full bg-white border-collapse courier-font">
            <thead>
              <tr className="">
                {headerCols.map((header, index) => (
                  <th key={index} className="text-left px-4 py-2 font-bold">
                    {header.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowData.map((row, rowIndex) => (
                <tr key={rowIndex} className="">
                  {headerCols.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className=" text-gray-600 text-start pl-3"
                    >
                      {row[cell.field] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimRegister;
