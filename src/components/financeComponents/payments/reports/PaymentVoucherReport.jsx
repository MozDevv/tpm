import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Backdrop, CircularProgress, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import './paymenVoucher.css';

const PaymentVoucher = () => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    const element = contentRef.current;

    // A4 page dimensions in inches (Width x Height)
    const pageWidth = 8.27; // A4 width in inches
    const pageHeight = 11.69; // A4 height in inches

    // Convert content dimensions from pixels to inches (assuming 96 DPI)
    const contentWidth = element.scrollWidth / 96; // in inches
    const contentHeight = element.scrollHeight / 96; // in inches

    // Calculate scaling factor to fit the content within the A4 page
    const scaleX = pageWidth / contentWidth;
    const scaleY = pageHeight / contentHeight;

    // Use the minimum scale factor to ensure both width and height fit on the page
    const scale = Math.min(scaleX, scaleY) * 0.85; // Reduce the scale factor by 15%

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Payment_Voucher.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    // Create a wrapper to hold the cloned content
    const wrapper = document.createElement('div');
    wrapper.style.width = `${contentWidth * 96}px`; // Convert back to pixels for proper rendering
    wrapper.style.height = `${contentHeight * 96}px`;
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';
    // Create the watermark element
    const watermark = document.createElement('div');
    watermark.textContent = 'MOF - Pensions';
    watermark.style.position = 'absolute';
    watermark.style.left = '50%';
    watermark.style.top = '50%';
    watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermark.style.fontSize = '5rem'; // Adjust the font size as needed
    watermark.style.fontFamily = 'Georgia, serif'; // Use a more elegant font
    watermark.style.fontWeight = 'lighter'; // Lighter weight for subtlety
    watermark.style.color = 'rgba(0, 0, 0, 0.05)'; // Very light gray color for watermark
    watermark.style.whiteSpace = 'nowrap';
    watermark.style.pointerEvents = 'none'; // Ensure the watermark doesn't interfere with other elements
    watermark.style.zIndex = '10'; // Ensure watermark is below content

    wrapper.appendChild(watermark);

    const clonedElement = element.cloneNode(true);
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.width = `${contentWidth * 96}px`; // Revert to pixel values
    clonedElement.style.height = `${contentHeight * 96}px`;

    wrapper.appendChild(clonedElement);

    html2pdf()
      .set(options)
      .from(wrapper)
      .save()
      .then(() => {
        clonedElement.style.transform = ''; // Reset the transform after saving
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-full">
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 99999 }}
          open={open}
          onClick={() => setLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Please wait while the PDF is being generated
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <Close />
      </IconButton>
      <div
        style={{
          transform: 'scale(0.9)', // Adjust the scale as needed
          transformOrigin: 'center center',
          width: '100%', // Ensure the width is 100% to fit the dialog
          height: '100%', // Ensure the height is 100% to fit the dialog
          overflow: 'auto', // Enable scrolling for overflow content
        }}
        className="flex-grow"
      >
        <div
          ref={contentRef}
          className="border border-black w-full max-w-3xl mx-auto text-end courier-font "
        >
          <div className="">
            {/* Header */}
            <p className="font-bold absolute top-0 right-0">F.O.20 (Revised)</p>
            <div className="flex justify-center items-center mb-3">
              <div className="flex items-center justify-center flex-col">
                <p className="font-bold uppercase underline">
                  Republic of Kenya
                </p>
                <p className="uppercase font-bold text-[18px]">
                  Payment Voucher
                </p>
                <p>(Voted Provision)</p>
              </div>
            </div>
            <p className="text-sm underline text-start font-bold pl-1 mt-[-10px]">
              Payee&apos;s name and Address
            </p>

            {/* Payee Details */}
            <div className=" border-black mb-2">
              <div className="grid grid-cols-2 gap-2 pl-1">
                <div>
                  <p className="text-start flex flex-row ">
                    <strong>Bank Name: </strong> NATIONAL BANK OF KENYA LTD
                  </p>

                  <p className="text-start flex flex-row gap-2">
                    <strong>Pensioner Name:</strong> Joy Khalayi Chibeiya
                  </p>
                  <p className="text-start flex flex-row gap-2">
                    <strong>Claim Type:</strong> Retirement On Age Ground
                  </p>
                </div>
                <div className="pr-1">
                  <p>
                    <strong>Branch Name:</strong> 001521232560600
                  </p>
                  <p>
                    <strong>Account No:</strong> 001521232560600
                  </p>
                  <p>
                    <strong>ID:</strong> 35729128
                  </p>
                </div>
              </div>
            </div>

            <div className="relative ">
              {/* Background image with low opacity */}
              <div
                className="absolute inset-0 bg-no-repeat bg-center opacity-10"
                style={{
                  backgroundImage: `url('/mnt/data/image.png')`, // Add the correct path to your image
                  backgroundSize: 'contain',
                }}
              />

              <img
                src="/kenya.png"
                alt=""
                height={80}
                width={140}
                className="absolute left-[41%] top-[40px] opacity-40"
              />

              {/* Content over the image */}
              <div className="relative z-10 border-t border-black">
                {/* Table Headers */}
                <div className="grid grid-cols-8 border-b border-black">
                  <p className="p-1 col-span-3 border-r border-black text-center pt-1">
                    <strong>Particulars</strong>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">
                    <strong>LPO/LSO No.</strong>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">
                    <strong>Invoice No.</strong>
                  </p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    <strong>Sh.</strong>
                  </p>
                  <p className="p-1 col-span-1 text-right">
                    <strong>Cts</strong>
                  </p>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-8 border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start">
                    Being Payment of Returned Gratuity/Liability
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    5,124,998
                  </p>
                  <p className="p-1 col-span-1 text-right">85</p>
                </div>

                <div className="grid grid-cols-8 border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                    Payable Amount: <p>5,124,000.85</p>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    0
                  </p>
                  <p className="p-1 col-span-1 text-right">00</p>
                </div>

                <div className="grid grid-cols-8 border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                    Liability: <p>0.00</p>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    0
                  </p>
                  <p className="p-1 col-span-1 text-right">00</p>
                </div>

                <div className="grid grid-cols-8 border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                    Income Tax: <p>0.00</p>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    0
                  </p>
                  <p className="p-1 col-span-1 text-right">00</p>
                </div>

                <div className="grid grid-cols-8 border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                    Deduction To CAP: <p>0.00</p>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-1 border-r border-black">-</p>
                  <p className="p-1 col-span-2 text-right border-r border-black">
                    0
                  </p>
                  <p className="p-1 col-span-1 text-right">00</p>
                </div>

                <div className="grid grid-cols-8 border-b border-black">
                  <p className="p-1 col-span-3 border-r border-black text-start justify-between flex">
                    Net Payable:{' '}
                    <p className="font-bold border-l border-t border-black p-[1px]">
                      5,124,000.85
                    </p>
                  </p>
                  <p className="p-1 col-span-1 border-r border-black"></p>
                  <p className="p-1 col-span-1 border-r border-black"></p>
                  <p className="p-1 col-span-2 text-right border-r border-black"></p>
                  <p className="p-1 col-span-1 text-right">85</p>
                </div>

                <div className="grid grid-cols-8 border-black font-bold">
                  <p className="p-1 col-span-3 border-black text-start text-[12px]">
                    Amount Payable (In Words):
                  </p>
                  <p className="p-1 col-span-1 border-black"></p>
                  <p className="p-1 col-span-1 border-black border-r">
                    Total Sh.
                  </p>
                  <p className="p-1 col-span-2 text-right border-black border-b">
                    5,124,998
                  </p>
                  <p className="p-1 col-span-1 text-right border-b border-black">
                    85
                  </p>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-start  border-black pt-2 mb-1 mt-[-10px]">
                  <p className="p-2 text-start">
                    FIVE MILLION ONE HUNDRED TWENTY-FOUR THOUSAND NINE HUNDRED
                    NINETY-EIGHT Shilling AND EIGHTY-FIVE CENTS
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-2 border-b border-black pb-1 pl-2">
              <p className="text-start flex flex-row gap-5">
                <strong>Authority Reference No:</strong> APN/PC0000368915
              </p>
            </div>

            {/*Voucher Examined By */}
            <div className="grid grid-cols-2">
              {/* Left Section */}
              <div className="flex flex-col border-r border-black">
                <strong className="text-center mt-[-10px]">EXAMINATION</strong>
                <div className="flex flex-col items-start pl-3 border-b border-black  pr-1 pt-1">
                  <div className="flex flex-row gap-1 w-full">
                    <strong>Voucher Examined By:</strong>
                    <div className="flex-grow border-b border-gray-400 p-1"></div>
                  </div>
                  <div className="flex flex-row gap-1 w-full mt-1">
                    <strong>Date:</strong>
                    <div className="flex-grow border-b border-gray-400 p-1"></div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col w-full">
                <strong className="text-center mt-[-10px]">
                  Internal Audit
                </strong>
                <div className="flex flex-col items-start pl-3 border-b border-black  pr-1 pt-1">
                  <div className="w-full border-b border-gray-400 p-1 mb-2"></div>
                  <div className="w-full border-b border-gray-400 p-1 mt-1 mb-2"></div>
                </div>
              </div>
            </div>

            {/* Certification Section */}
            <div className="grid grid-cols-2 border-b border-black pb-2">
              <div className="border-r border-black pr-2">
                <p className="font-bold uppercase text-center">
                  VBC Certificate
                </p>
                <p className="text-start pl-3">
                  I certify that the expenditure has been entered in the Vote
                  Book and that adequate funds to cover it are available against
                  the chargeable item as shown below.
                </p>

                {/* Approved Estimates/Allocation */}
                <div className="flex flex-col pl-2">
                  <p className="text-start mt-2 mb-2">
                    Approved Estimates/Allocation -
                  </p>
                  <div className="flex flex-row justify-between items-center gap-4 px-4">
                    {/* Item No section */}
                    <div className="flex items-center w-full">
                      <p className="mr-2">
                        <strong>Item No:</strong>
                      </p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>

                    {/* Ksh section */}
                    <div className="flex items-center w-full">
                      <p className="mr-2">Ksh.</p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>
                  </div>
                </div>

                {/* Less: Total Expenditure plus */}
                <div className="flex flex-col pl-2">
                  <p className="text-start mt-2 mb-2">
                    Less: Total Expenditure plus -
                  </p>
                  <div className="flex flex-row justify-between items-center gap-4 px-4">
                    <div className="flex items-center w-full">
                      <p className="mr-2">
                        <strong>Commitments.</strong>
                      </p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>

                    <div className="flex items-center w-full">
                      <p className="mr-2">Ksh.</p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="flex flex-row justify-between items-center gap-4 px-4">
                    <div className="flex items-center w-full">
                      <p className="mr-2">
                        <strong>Balance.</strong>
                      </p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>

                    <div className="flex items-center w-full">
                      <p className="mr-2">Ksh.</p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>
                  </div>
                </div>

                {/* Less: This ENTRY ---Vch */}
                <div className="flex flex-col pl-2">
                  <p className="text-start mt-2 mb-2">
                    Less: This ENTRY ---Vch. -
                  </p>
                  <div className="flex flex-row justify-between items-center gap-4 px-4">
                    <div className="flex items-center w-full">
                      <p className="mr-2">
                        <strong>No.</strong>
                      </p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>

                    <div className="flex items-center w-full">
                      <p className="mr-2">Ksh.</p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="flex flex-row justify-between items-center gap-4 px-4">
                    <div className="flex items-center w-full">
                      <p className="mr-2">
                        <strong>Balance.</strong>
                      </p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>

                    <div className="flex items-center w-full">
                      <p className="mr-2">Ksh.</p>
                      <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                      {/* Input area */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between items-center gap-4 pl-1 mt-2">
                  <div className="flex items-center w-full">
                    <p className="mr-2">
                      <strong>Date.</strong>
                    </p>
                    <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                    {/* Input area */}
                  </div>

                  <div className="flex items-center w-full">
                    <p className="mr-2">Signature.</p>
                    <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                    {/* Input area */}
                  </div>
                </div>
              </div>

              {/* AIE Holder Certificate */}
              <div className="pl-1">
                <div className="flex flex-col border-b border-black pb-3 gap-5">
                  <div className="">
                    <p className="font-bold uppercase text-center">
                      AIE Holder Certificate
                    </p>
                    <p className="text-start">
                      I certify that the expenditure detailed above has been
                      incurred for the authorized purpose and should be charged
                      to the item shown here below.
                    </p>
                    <div className="flex flex-row justify-between items-center gap-4 pl-1 mt-2">
                      <div className="flex items-center w-full">
                        <p className="mr-2">
                          <strong>Date.</strong>
                        </p>
                        <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                        {/* Input area */}
                      </div>

                      <div className="flex items-center w-full">
                        <p className="mr-2">Signature.</p>
                        <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                        {/* Input area */}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-black pt-2">
                    <p className="font-bold uppercase text-center">
                      Authorization
                    </p>
                    <p className="text-start">
                      I certify that the rate/price charged is/are according to
                      regulation/contract, fair and reasonable, that the
                      expenditure has been incurred on proper authority and
                      should be charged as under Where appropriate a certificate
                      overleaf has been completed. I hereby AUTHORIZE payment of
                      the amount shown above without any alteration.
                    </p>
                    <div className="flex flex-col items-center gap-2 pl-1 mt-[1px]">
                      <div className="flex items-center w-full">
                        <p className="mr-2 font-bold">Signature.</p>
                        <div className="flex-grow mr-1">
                          <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                          <p className="text-[12px] flex-start">
                            Accounting Officer/District Commisioner*
                          </p>
                        </div>

                        {/* Input area */}
                      </div>
                      <div className="flex items-center w-full mt-[-10px]">
                        <p className="mr-2">
                          <strong>Date.</strong>
                        </p>
                        <div className="border-b border-gray-400 flex-grow h-7"></div>{' '}
                        {/* Input area */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}

            <div className="grid grid-cols-4 border-b border-black">
              <div className="border-r border-black h-[45px]">
                <p className="text-center pt-1 font-semibold">Vote</p>
              </div>
              <div className="border-r border-black  h-[45px]">
                <p className="text-center pt-1 font-semibold">Head</p>
              </div>
              <div className="border-r border-black  h-[45px]">
                <p className="text-center pt-1 font-semibold">SubHead</p>
              </div>
              <div className=" border-black h-[45px]">
                <p className="text-center pt-1 font-semibold">Item</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-0 border-black text-sm">
              {/* Header Row */}
              <div className="col-span-1 border-r border-black p-2 text-center">
                A.I.E. No.
              </div>
              <div className="col-span-2 border-r border-black p-2 text-center">
                Account No.
              </div>
              <div className="col-span-2 border-r border-black p-2 text-center">
                Dept Vch.
              </div>
              <div className="col-span-1 border-r border-black p-2 text-center">
                Station
              </div>
              <div className="col-span-3 grid grid-cols-2 border-r border-black">
                <div className="col-span-2 text-center p-2 border-b border-black">
                  Cash Book
                </div>
                <div className="border-r border-black text-center p-2">
                  Vch. No.
                </div>
                <div className="text-center p-2">Date</div>
              </div>
              <div className="col-span-3 grid grid-cols-3">
                <div className="col-span-3 text-center p-2 border-b border-black">
                  Amount
                </div>
                <div className="col-span-2 border-r border-black text-center p-2">
                  Sh.
                </div>
                <div className="col-span-1 text-center p-2">cts.</div>
              </div>

              {/* Data Row */}
              <div className="col-span-1 border-t border-black border-r p-2 text-center">
                0-970-8820-7320119
              </div>
              <div className="col-span-2 border-t border-black border-r p-2 text-center">
                PV2023-24_022295
              </div>
              <div className="col-span-2 border-t border-black border-r p-2 text-center">
                {/* Dept Vch content here */}
              </div>
              <div className="col-span-1 border-t border-black border-r p-2 text-center">
                {/* Station content here */}
              </div>
              <div className="col-span-3 grid grid-cols-2 border-t border-black border-r">
                <div className="border-r border-black p-2 text-center">
                  {/* Vch. No. */}
                </div>
                <div className="p-2 text-center">{/* Date */}</div>
              </div>
              <div className="col-span-3 grid grid-cols-3 border-t border-black">
                <div className="col-span-2 border-r border-black p-2 text-right">
                  5,124,998.85
                </div>
                <div className="col-span-1 p-2 text-right"></div>
              </div>
            </div>

            {/* Footer */}
          </div>
        </div>
      </div>

      <div className="bg-white h-[70px] w-full">
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded absolute bottom-6"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentVoucher;
