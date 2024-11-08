import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const PaymentVoucher = () => {
  const contentRef = useRef();

  const handleDownload = () => {
    const element = contentRef.current;
    const options = {
      margin: 0.5,
      filename: 'Payment_Voucher.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="p-4">
      <div
        ref={contentRef}
        className="border border-black p-4 w-full max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold">REPUBLIC OF KENYA</p>
            <p>PAYMENT VOUCHER</p>
            <p>(VOTED PROVISION)</p>
          </div>
          <p className="font-bold">F.O.20 (Revised)</p>
        </div>

        {/* Payee Details */}
        <div className="border-b border-black mb-4 pb-2">
          <p>
            <strong>Bank Name:</strong> NATIONAL BANK OF KENYA LTD
          </p>
          <p>
            <strong>Branch Name:</strong> N.B.K. - KAKAMEGA
          </p>
          <p>
            <strong>Account No:</strong> 001521232560600
          </p>
          <p>
            <strong>Pensioner Name:</strong> Joy Khalayi Chibeiya
          </p>
          <p>
            <strong>Claim Type:</strong> Retirement On Age Ground
          </p>
          <p>
            <strong>ID:</strong> 35729128
          </p>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-4 gap-4 border-b border-black mb-4 pb-2">
          <p>
            <strong>Particulars</strong>
          </p>
          <p>
            <strong>LPO/LSO No.</strong>
          </p>
          <p>
            <strong>Invoice No.</strong>
          </p>
          <p className="text-right">
            <strong>Amount</strong>
          </p>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <p>Being Payment of Returned Gratuity/Liability</p>
          <p>-</p>
          <p>-</p>
          <p className="text-right">5,124,998.85</p>

          <p>Liability:</p>
          <p>-</p>
          <p>-</p>
          <p className="text-right">0.00</p>

          <p>Income Tax:</p>
          <p>-</p>
          <p>-</p>
          <p className="text-right">0.00</p>

          <p>Deduction to CAP:</p>
          <p>-</p>
          <p>-</p>
          <p className="text-right">0.00</p>

          <p className="font-bold">Net Payable:</p>
          <p></p>
          <p></p>
          <p className="text-right font-bold">5,124,998.85</p>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between border-t border-black pt-2 mb-4">
          <p>
            <strong>Total (in words):</strong> FIVE MILLION ONE HUNDRED
            TWENTY-FOUR THOUSAND NINE HUNDRED NINETY-EIGHT Shilling AND
            EIGHTY-FIVE CENTS
          </p>
          <p className="font-bold">TOTAL Sh. 5,124,998.85</p>
        </div>

        {/* Authority Reference */}
        <div>
          <p>
            <strong>Authority Reference No.:</strong> APN/PC0000368915
          </p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default PaymentVoucher;
