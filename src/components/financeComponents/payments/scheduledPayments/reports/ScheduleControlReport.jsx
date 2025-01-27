import React from 'react';

const ScheduleControlReport = ({ data }) => {
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="text-center">
        <h2 className="font-bold text-base">CENTRAL BANK OF KENYA</h2>
        <p className="text-xs">Schedule Control Report for EFT</p>
        <div className="flex justify-between text-xs">
          <p>Ministry/Department: C.F.S. Pensions Nairobi</p>
          <p>Report Date: 18-DEC-24</p>
        </div>
        <div className="flex justify-between text-xs">
          <p>Code: 0059</p>
          <p>Acct Title: Recurrent Vote</p>
        </div>
      </div>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th className="px-2 py-1 text-xs underline">No</th>
            <th className="px-2 py-1 text-xs underline">Name (Bank)</th>
            <th className="px-2 py-1 text-xs underline">Payee (Bank)</th>
            <th className="px-2 py-1 text-xs underline">EFT Status</th>
            <th className="px-2 py-1 text-xs underline">EFT Date</th>
            <th className="px-2 py-1 text-xs underline">EFT Number</th>
            <th className="px-2 py-1 text-xs underline">Amount (Ksh.)</th>
            <th className="px-2 py-1 text-xs underline">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="px-2 py-1 text-xs">{index + 1}</td>
              <td className="px-2 py-1 text-xs">
                {item.bankAccountName || 'N/A'}
              </td>
              <td className="px-2 py-1 text-xs">C</td>
              <td className="px-2 py-1 text-xs">11-DEC-24</td>
              <td className="px-2 py-1 text-xs">
                {item.eftNo || '0000000000'}
              </td>
              <td className="px-2 py-1 text-xs">
                {item.pensionAmount ? item.pensionAmount.toFixed(2) : 'N/A'}
              </td>
              <td className="px-2 py-1 text-xs">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleControlReport;
