import { formatNumber } from '@/utils/numberFormatters';

import React, { use, useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Empty } from 'antd';
import { Backdrop, Button } from '@mui/material';
import { Cancel, GetApp } from '@mui/icons-material';

const ReceiptVoucher = ({
  clickedItem,
  drAccounts,
  crAccounts,
  setOpenReceiptReport,
}) => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [retiree, setRetiree] = useState(null);

  const handleDownload = () => {
    setLoading(true);
    const element = contentRef.current;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Gratuity Notification Letter.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    // Create a wrapper to hold the cloned content
    const wrapper = document.createElement('div');
    wrapper.style.width = `${fixedWidth}px`;
    wrapper.style.height = `${fixedHeight}px`;
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

    const clonedElement = element.cloneNode(true);
    const scale = 0.86; // Scale factor to reduce the size
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'top left';
    clonedElement.style.width = `${fixedWidth}px`;
    clonedElement.style.height = `${fixedHeight}px`;

    wrapper.appendChild(clonedElement);

    html2pdf()
      .set(options)
      .from(wrapper)
      .save()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const generatePdfBlob = () => {
    setTimeout(() => {
      const element = contentRef.current;

      // Define fixed dimensions for the content (in pixels)
      const fixedWidth = 770; // Width in pixels
      const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

      // Define options for the PDF
      const options = {
        margin: 0.5, // Default margin (in inches)
        filename: 'Voucher.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      // Create a wrapper to hold the cloned content
      const wrapper = document.createElement('div');
      wrapper.style.width = `${fixedWidth}px`;
      wrapper.style.height = `${fixedHeight}px`;
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

      //   wrapper.appendChild(watermark);

      const clonedElement = element.cloneNode(true);
      const scale = 0.86; // Scale factor to reduce the size
      clonedElement.style.transform = `scale(${scale})`;
      clonedElement.style.transformOrigin = 'top left';
      clonedElement.style.width = `${fixedWidth}px`;
      clonedElement.style.height = `${fixedHeight}px`;

      wrapper.appendChild(clonedElement);

      html2pdf()
        .set(options)
        .from(wrapper)
        .outputPdf('blob')
        .then((pdfBlob) => {
          setPdfBlob(pdfBlob);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 100); // Adjust the delay as needed
  };
  useEffect(() => {
    if (report) {
      // Add a small delay to ensure the DOM is fully updated
      setTimeout(() => {
        generatePdfBlob();
      }, 100); // Adjust the delay as needed
    }
  }, [report]);
  return (
    <div
      className="flex-grow"
      style={{
        width: '100%', // Ensure the width is 100% to fit the dialog
        height: '100%', // Ensure the height is 100% to fit the dialog
        overflow: 'auto', // Enable scrolling for overflow content
      }}
    >
      <div
        className="bg-white h-[80px] flex flex-row justify-between pt-2 items-center  px-4 w-full"
        style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Receipt Voucher
          </h2>
          <p className="text-sm text-gray-500">
            Detailed analysis and insights
          </p>
        </div>
        <div className="space-x-4">
          <Button
            onClick={handleDownload}
            variant="contained"
            color="primary"
            startIcon={<GetApp />}
            className="px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Download PDF
          </Button>
          <Button
            onClick={() => setOpenReceiptReport(false)}
            variant="outlined"
            color="primary"
            startIcon={<Cancel />}
            className="px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Cancel
          </Button>
        </div>
      </div>
      {pdfBlob ? (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            overflow: 'auto',
          }}
          title="Page 5 PDF"
        />
      ) : (
        <div className="flex items-center justify-center min-h-[65vh]">
          <div className="text-center">
            <Empty description="No PDF available to display." />
          </div>
        </div>
      )}{' '}
      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 99999 }}
          open={open}
          onClick={() => setLoading(false)}
        >
          {/* <span class="loader"></span> */}
          <div className="ml-3 font-semibold text-xl flex items-center">
            Generating report, please hold on
            <div className="ellipsis ml-1 mb-4">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </Backdrop>
      )}
      <div className="" style={{ display: 'none' }}>
        <div
          ref={contentRef}
          className="border-2 border-black max-w-4xl mx-auto text-sm font-mono"
        >
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

                  <div className="border-black grid grid-cols-3 px-4 mt-4 items-center w-full">
                    <div>
                      <p className="font-bold">Personal Number</p>
                      <p>{clickedItem?.returnDetails[0]?.pensionerNo}</p>
                    </div>
                    <div>
                      <p className="font-bold">Name</p>
                      <p>{clickedItem?.returnDetails[0]?.pensionerName}</p>
                    </div>
                    <div>
                      <p className="font-bold">Amount</p>
                      <p>
                        {formatNumber(clickedItem?.returnDetails[0]?.amount)}
                      </p>
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
            <p className="font-bold">
              Total:
              {formatNumber(clickedItem?.returnDetails[0]?.amount)}
            </p>
          </div>

          {/* Payment Notice */}
          <div className="mt-3 w-full px-2">
            <p>
              Please receive(or)Please note that the sum shown above has been
              paid into............................................. Bank
              Account on the........................; the paying-in slip is
              attached.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 border-b border-black">
            <div className=" grid grid-cols-4 p-4 gap-4">
              <div className="border-t border-black">
                <p className="text-center">Date</p>
              </div>
              <div className="border-t border-black">
                <p className="text-center"> Signature</p>
              </div>
              <div className="border-t border-black">
                <p className="text-center">Designation</p>
              </div>
              <div className="mt-[-25px]">
                <p className="mb-[-10px] font-bold text-center">PENSIONS</p>{' '}
                ________________________
                <p className=" text-center">Department</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-black ">
              <div className="border-r border-black h-[60px]">
                <p className="text-center pt-1 font-semibold">Vote</p>
                <p className="text-center pt-1 font-semibold">DEPOSIT & FUND</p>
              </div>
              <div className="border-r border-black  h-[60px]">
                <p className="text-center pt-1 font-semibold">Head</p>
                <p className="text-center pt-1 font-semibold">SUSUPENSE</p>
              </div>
              <div className="border-r border-black  h-[60px]">
                <p className="text-center pt-1 font-semibold">SubHead</p>
                <p className="text-center pt-1 font-semibold">
                  31% CONTRIBUTION
                </p>
              </div>
            </div>
          </div>

          {/* Cash book */}
          <div className="mt-8">
            <table className=" w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2">Account No.</th>
                  <th className="border border-black p-2">Dept.Vch.No.</th>
                  <th className="border border-black p-2">Station</th>

                  <th className="border border-black ">
                    <div className="text-center">Cash Book</div>
                    <table className="w-full">
                      <thead>
                        <tr className="p-0">
                          <th className="text-left border-t border-r border-black">
                            Voucher No.
                          </th>
                          <th className="text-left border-t pl-1 border-black">
                            Date
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th className="border border-black ">
                    <div className="text-center">Amount</div>
                    <table className="w-full">
                      <thead>
                        <tr className="p-0">
                          <th className="text-left border-t border-r border-black">
                            Sh.
                          </th>
                          <th className="text-left border-t pl-1 border-black">
                            cts
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                </tr>
              </thead>
              <tbody className="h-[100px]">
                <tr>
                  <td className="border border-black p-2">
                    {crAccounts &&
                      crAccounts.length > 0 &&
                      crAccounts?.find(
                        (account) => account.id === clickedItem?.crAccountId
                      )?.accountNo}
                  </td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2">
                    {drAccounts &&
                      drAccounts.length > 0 &&
                      drAccounts?.find(
                        (account) => account.id === clickedItem?.drAccountId
                      ).accountNo}
                  </td>
                  <td className="border border-black p-2 text-right">
                    {formatNumber(clickedItem?.returnDetails[0]?.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptVoucher;
