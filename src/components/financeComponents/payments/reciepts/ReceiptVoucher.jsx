import React from 'react';

const ReceiptVoucher = () => {
  return (
    <div className="border-2 border-black max-w-4xl mx-auto text-sm font-mono">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold uppercase">Republic of Kenya</h1>
        <p className="uppercase font-semibold">Receipt Voucher</p>

        <p className="font-bold">THE CHIEF ACCOUNTANT PENSIONS - NAIROBI</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-12 items-center mt-8  border-b border-black">
        {/* Main Content */}
        <div className="col-span-9 w-full border-r border-black h-[500px]">
          <div>
            <p className="font-bold text-center border-t border-b border-black py-4">
              Particulars of Summary
            </p>
            <div className="mt-4">
              <p className="px-4 mb-2">
                Being receipt of Cheque/Deposit for 31% Contribution
              </p>
              <p className="px-4">
                RECEIPTED VIDE OUR MR-NO: 6148751 OF 13-FEB-25
              </p>

              <div className="border-black grid grid-cols-3 px-4 mt-4 items-center">
                <div>
                  <p className="font-bold">Personal Number</p>
                  <p>373448</p>
                </div>
                <div>
                  <p className="font-bold">Name</p>
                  <p>Daniel-Wangombe</p>
                </div>
                <div>
                  <p className="font-bold">Amount</p>
                  <p>45,960.30</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Sh and Cts */}
        <div className="col-span-3  h-[500px]">
          <div className="border-black ">
            <table className="table- border-collapse w-full">
              <thead>
                <tr className="border-t border-black">
                  <th className="border-b border-black px-2 py-1 text-left">
                    Amount
                  </th>
                </tr>
                <tr>
                  <th className="px-2 py-1 text-left border-b border-black">
                    Sh.
                  </th>
                  <th className="px-2 py-1 text-left border-b border-l border-t border-black">
                    cts
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="text-right pr-4 py-1 border-b border-black">
        <p className="font-bold">Total: 45,960.30</p>
      </div>

      {/* Payment Notice */}
      <div className="mt-3">
        <p>
          Please receive(or)Please note that the sum shown above has been paid
          into............
        </p>
        <p>
          Bank Account on the........................; the paying-in slip is
          attached.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8">
        <div className="border-t border-black grid grid-cols-4 p-4">
          <div className="">
            <p>Date</p>
          </div>
          <div>
            <p>Signature</p>
          </div>
          <div>
            <p>Designation</p>
            <p className="font-bold">HEAD/SUB-HEAD</p>
          </div>
          <div>
            <p>PENSIONS</p>
            <p className="font-bold">Department</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-bold">PENSIONS</p>
          <p>DEPOSIT & FUND SUSPENSE</p>
          <p>ITEM 31% Contribution</p>
        </div>
      </div>

      {/* Cash book */}
      <div className="mt-8">
        <table className="border-collapse border border-black w-full text-left text-sm">
          <thead>
            <tr>
              <th className="border border-black p-2">Account No.</th>
              <th className="border border-black p-2">Dept.Vch.No.</th>
              <th className="border border-black p-2">Station</th>
              <th className="border border-black p-2">Cash book</th>
              <th className="border border-black p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">4-869-0900-7310209</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2">RV2024-25_011972</td>
              <td className="border border-black p-2 text-right">45,960.30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptVoucher;
