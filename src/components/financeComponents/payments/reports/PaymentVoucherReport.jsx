import React, { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Backdrop, Button, CircularProgress, IconButton } from '@mui/material';
import { Cancel, Close, GetApp, Refresh } from '@mui/icons-material';
import './paymenVoucher.css';
import { useAuth } from '@/context/AuthContext';
import financeEndpoints, { apiService } from '@/components/services/financeApi';

import {
  amountToWords,
  formatBankAccount,
  formatNumber,
} from '@/utils/numberFormatters';
import { Empty } from 'antd';

const PaymentVoucher = ({ setOpenTrialBalanceReport, clickedItem }) => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const { auth } = useAuth();

  const [pdfBlob, setPdfBlob] = useState(null);

  const handleDownload = () => {
    setLoading(true);
    const element = contentRef.current;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Payment_Voucher.pdf',
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

    wrapper.appendChild(watermark);

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
    const element = contentRef.current;

    // Reduced fixed dimensions for the content (in pixels)
    const fixedWidth = 770; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    // Define options for the PDF
    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Payment_Voucher.pdf',
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

    wrapper.appendChild(watermark);

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
  };

  const fetchPVReport = async () => {
    setLoading(true);
    try {
      const res = await apiService.get(
        financeEndpoints.getPaymentVoucherReport(clickedItem?.id)
      );

      if (res.data.succeeded) {
        console.log('Report:', res.data.data[0]);
        setReport(res.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPVReport();
  }, []);

  useEffect(() => {
    if (report) {
      // Add a small delay to ensure the DOM is fully updated
      setTimeout(() => {
        generatePdfBlob();
      }, 100); // Adjust the delay as needed
    }
  }, [report]);

  return (
    <div className={`flex flex-col h-full`}>
      <div
        className="bg-white h-[80px] flex flex-row justify-between pt-2 items-center  px-4 w-full"
        style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Payment Voucher Report
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
          <IconButton
            onClick={() => {
              // fetchPVReport();
              generatePdfBlob();
            }}
          >
            <Refresh />
          </IconButton>
          <Button
            onClick={() => setOpenTrialBalanceReport(false)}
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
      <div
        style={{
          transform: 'scale(0.9)', // Adjust the scale as needed
          transformOrigin: 'center center',
          width: '100%', // Ensure the width is 100% to fit the dialog
          height: '100%', // Ensure the height is 100% to fit the dialog
          overflow: 'auto', // Enable scrolling for overflow content
          display: 'none',
        }}
        className="flex-grow"
      >
        <div ref={contentRef} className="courier-font gap-4">
          <div className="border border-black w-full max-w-3xl mx-auto text-end courier-font ">
            <div className="">
              {/* Header */}
              <p className="font-bold absolute top-0 right-0">
                F.O.20 (Revised)
              </p>
              <div className="flex justify-center items-center mb-3">
                <div className="flex items-center justify-center flex-col gap-2">
                  <p className="font-bold uppercase underline underline-offset-4">
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
              <div className="border-black mb-2">
                <div className="grid grid-cols-3 gap-2 pl-1">
                  <div>
                    <p className="text-start flex flex-row">
                      <strong>Bank Name: </strong>
                      {report?.bankName}
                    </p>
                    <p className="text-start flex flex-row gap-2">
                      <strong>Pensioner Name:</strong> {report?.pensionerName}
                    </p>
                    <p className="text-start flex flex-row gap-2">
                      <strong>Claim Type:</strong> {report?.claimType}
                    </p>
                  </div>
                  <div className="pr-1 items-start">
                    <p className="text-start flex flex-row gap-2">
                      <strong>Branch Name:</strong> {report?.bankBranchName}
                    </p>
                    <p className="text-start flex flex-row gap-2">
                      <strong>Account No:</strong> {report?.bankAccountNo}
                    </p>
                    <p className="text-start flex flex-row gap-2">
                      <strong>ID:</strong> {report?.idNumber}
                    </p>
                  </div>
                  <div className="pr-1 items-start">
                    <p className="text-start flex flex-row gap-2">
                      <strong> Monthly Pension:</strong>{' '}
                      {report?.totalMonthlyPensionAmount
                        ? Math.floor(
                            report.totalMonthlyPensionAmount
                          ).toLocaleString('en-US')
                        : '0'}
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
                    <p className="p-1 col-span-2 text-right border-r border-black"></p>
                    <p className="p-1 col-span-1 text-right">85</p>
                  </div>

                  <div className="grid grid-cols-8 border-black">
                    <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                      Payable Amount
                    </p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-2 text-right border-r border-black">
                      {report?.grossAmount
                        ? Math.floor(report.grossAmount).toLocaleString('en-US')
                        : '0'}
                    </p>
                    <p className="p-1 col-span-1 text-right">
                      {report?.grossAmount
                        ? report.grossAmount
                            .toString()
                            .split('.')[1]
                            ?.slice(0, 2) || '00'
                        : '00'}
                    </p>
                  </div>

                  <div className="grid grid-cols-8 border-black">
                    <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                      Liability:
                    </p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-2 text-right border-r border-black">
                      {report?.totalLiabilityAmount
                        ? Math.floor(
                            report.totalLiabilityAmount
                          ).toLocaleString('en-US')
                        : '0'}
                    </p>
                    <p className="p-1 col-span-1 text-right">
                      {report?.totalLiabilityAmount
                        ? report.totalLiabilityAmount
                            .toString()
                            .split('.')[1]
                            ?.slice(0, 2) || '00'
                        : '00'}
                    </p>
                  </div>
                  {report?.deductionsAndOtherPayments?.map(
                    (deduction, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-8 border-black"
                      >
                        <p className="p-1 col-span-3 border-r border-black text-start">
                          {deduction.description}
                        </p>
                        <p className="p-1 col-span-1 border-r border-black">
                          -
                        </p>
                        <p className="p-1 col-span-1 border-r border-black">
                          -
                        </p>
                        <p className="p-1 col-span-2 text-right border-r border-black">
                          {deduction.liabilityAmt
                            ? Math.floor(deduction.liabilityAmt).toLocaleString(
                                'en-US'
                              )
                            : '0'}
                        </p>
                        <p className="p-1 col-span-1 text-right">
                          {deduction.liabilityAmt
                            ? deduction.liabilityAmt
                                .toString()
                                .split('.')[1]
                                ?.slice(0, 2) || '00'
                            : '00'}
                        </p>
                      </div>
                    )
                  )}

                  <div className="grid grid-cols-8 border-black">
                    <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                      Total Tax Amount:
                    </p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-2 text-right border-r border-black">
                      {report?.totalTaxAmount
                        ? Math.floor(report.totalTaxAmount).toLocaleString(
                            'en-US'
                          )
                        : '0'}
                    </p>
                    <p className="p-1 col-span-1 text-right">
                      {report?.totalTaxAmount
                        ? report.totalTaxAmount
                            .toString()
                            .split('.')[1]
                            ?.slice(0, 2) || '00'
                        : '00'}
                    </p>
                  </div>

                  <div className="grid grid-cols-8 border-black">
                    <p className="p-1 col-span-3 border-r border-black text-start flex justify-between">
                      Total Refund Amount
                    </p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-1 border-r border-black">-</p>
                    <p className="p-1 col-span-2 text-right border-r border-black">
                      {report?.totalRefundAmount
                        ? Math.floor(report.totalRefundAmount).toLocaleString(
                            'en-US'
                          )
                        : '0'}
                    </p>
                    <p className="p-1 col-span-1 text-right">
                      {report?.totalRefundAmount
                        ? report.totalRefundAmount
                            .toString()
                            .split('.')[1]
                            ?.slice(0, 2) || '00'
                        : '00'}
                    </p>
                  </div>

                  <div className="grid grid-cols-8 border-b border-black">
                    <p className="p-1 col-span-3 border-r border-black text-start justify-between flex">
                      Net Payable:{' '}
                      <p className="font-bold border-l border-t border-black p-[1px]">
                        {formatNumber(report?.netAmount)}
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
                    <p className="p-1 col-span-2 text-right border-r border-black border-b">
                      {report?.netAmount
                        ? Math.floor(report.netAmount).toLocaleString('en-US')
                        : '0'}
                    </p>
                    <p className="p-1 col-span-1 text-right border-b border-black ">
                      {report?.netAmount
                        ? report.netAmount
                            .toString()
                            .split('.')[1]
                            ?.slice(0, 2) || '00'
                        : '00'}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-start  border-black pt-2 mb-1 mt-[-10px]">
                    <p className="p-2 text-start">
                      {report?.netAmount
                        ? amountToWords(report.netAmount)
                        : 'Zero Shillings Only'}
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
                  <strong className="text-center mt-[-10px]">
                    EXAMINATION
                  </strong>
                  <div className="flex flex-col items-start pl-3 border-b border-black  pr-1">
                    <div className="flex flex-row gap-1 w-full">
                      <strong>Voucher Examined By:</strong>
                      <div className="flex-grow border-b border-gray-400 p-1"></div>
                    </div>
                    <div className="flex flex-row gap-1 w-full mb-[5px]">
                      <strong className="">Date:</strong>
                      <div className="flex-grow border-b border-gray-400 p-1 "></div>
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
                  <p className="text-start pl-3 font-semibold">
                    I certify that the expenditure has been entered in the Vote
                    Book and that adequate funds to cover it are available
                    against the chargeable item as shown below.
                  </p>

                  {/* Approved Estimates/Allocation */}
                  <div className="flex flex-col pl-2">
                    <p className="text-start mt-2 mb-2 font-semibold">
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
                        <div className="border-b border-gray-400 flex-grow h-7">
                          {formatNumber(report?.budgetAmount)}
                        </div>{' '}
                        {/* Input area */}
                      </div>
                    </div>
                  </div>

                  {/* Less: Total Expenditure plus */}
                  <div className="flex flex-col pl-2">
                    <p className="text-start mt-2 mb-2 font-semibold">
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
                        <div className="border-b border-gray-400 flex-grow h-7">
                          {formatNumber(report?.spentAmount)}
                        </div>{' '}
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
                        <div className="border-b border-gray-400 flex-grow h-7">
                          {formatNumber(report?.budgetBalanceBefore)}
                        </div>{' '}
                        {/* Input area */}
                      </div>
                    </div>
                  </div>

                  {/* Less: This ENTRY ---Vch */}
                  <div className="flex flex-col pl-2">
                    <p className="text-start mt-2 mb-2 font-semibold">
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
                        <div className="border-b border-gray-400 flex-grow h-7">
                          {formatNumber(report?.grossAmount)}
                        </div>{' '}
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
                        <div className="border-b border-gray-400 flex-grow h-7">
                          {formatNumber(report?.budgetBalanceAfter)}
                        </div>{' '}
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
                    <div className="font-semibold">
                      <p className="font-bold uppercase text-center">
                        AIE Holder Certificate
                      </p>
                      <p className="text-start font-">
                        I certify that the expenditure detailed above has been
                        incurred for the authorized purpose and should be
                        charged to the item shown here below.
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
                    <div className="border-t border-black pt-2 font-semibold">
                      <p className="font-bold uppercase text-center">
                        Authorization
                      </p>
                      <p className="text-start">
                        I certify that the rate/price charged is/are according
                        to regulation/contract, fair and reasonable, that the
                        expenditure has been incurred on proper authority and
                        should be charged as under Where appropriate a
                        certificate overleaf has been completed. I hereby
                        AUTHORIZE payment of the amount shown above without any
                        alteration.
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

              <div className="grid grid-cols-4 border-b border-black ">
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

              <div className="grid grid-cols-12 gap-0 border-black text-sm font-semibold">
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
                <div className="col-span-1 border-t border-black border-r p-2 text-center"></div>
                <div className="col-span-2 border-t border-black border-r p-2 text-start">
                  {report?.gratiutyExpenseAccountNo
                    ? report?.gratiutyExpenseAccountNo
                    : 'N/A'}
                </div>
                <div className="col-span-2 border-t border-black border-r p-2 text-start">
                  {report?.voucherCode}
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
                    {formatNumber(report?.grossAmount)}
                  </div>
                  <div className="col-span-1 p-2 text-right"></div>
                </div>
              </div>

              {/* Footer */}
            </div>
          </div>

          <div className="flex justify-between w-full items-center px-5">
            <div className="flex items-center">
              <p className="font-bold">Printed By:</p>
              <div className="">{auth?.user?.name}</div>
            </div>
            <div className="flex items-center">
              <p className="font-bold">Date:</p>
              <div className="">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVoucher;
