import React, { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Backdrop, Button } from '@mui/material';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { formatNumber } from '@/utils/numberFormatters';
import { Cancel, GetApp } from '@mui/icons-material';
import { Empty } from 'antd';
const GratuityLetterReport = ({ setOpenGratuity, clickedItem }) => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

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
    const scale = Math.min(scaleX, scaleY) * 0.9; // Reduce the scale factor by 10%

    // Define options for the PDF
    const options = {
      margin: 0.2, // Reduced margin
      filename:
        'Letter of Notification on Payment of Gratuity, pension and deductions to pensioner.pdf',
      html2canvas: { scale: 1.5 }, // Lower the canvas scale to reduce content size
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compressPDF: true,
      }, // Enable compression
    };

    // Create a wrapper to hold the cloned content
    const wrapper = document.createElement('div');
    wrapper.style.width = `${pageWidth * 96}px`; // Set to A4 width (in pixels)
    wrapper.style.height = `${pageHeight * 96}px`; // Set to A4 height (in pixels)
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center'; // Center content horizontally
    wrapper.style.overflow = 'hidden';

    // Clone the content element
    const clonedElement = element.cloneNode(true);

    // Scale the cloned element
    clonedElement.style.transform = `scale(${scale})`;
    clonedElement.style.transformOrigin = 'center'; // Center the scaling
    clonedElement.style.width = `${contentWidth * 96}px`; // Revert to pixel values
    clonedElement.style.height = `${contentHeight * 96}px`;

    // Optionally, reduce font size and line height for more compact content
    clonedElement.style.fontSize = '0.9rem'; // Reduce font size slightly
    clonedElement.style.lineHeight = '1.2'; // Reduce line height to fit more text

    // Append the scaled and centered content to the wrapper
    wrapper.appendChild(clonedElement);

    // Generate the PDF
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

  const generatePdfBlob = () => {
    setTimeout(() => {
      const element = contentRef.current;

      // Define fixed dimensions for the content (in pixels)
      const fixedWidth = 770; // Width in pixels
      const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

      // Define options for the PDF
      const options = {
        margin: 0.5, // Default margin (in inches)
        filename: 'Gratuity_Letter.pdf',
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
            Page 5 Report
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
            onClick={() => setOpenGratuity(false)}
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
          display: 'none',
        }}
      >
        <div ref={contentRef} className="courier-font  p-8 max-w-3xl mx-auto ">
          {/* Header */}
          <div className="text-center mx-auto flex flex-col items-center">
            <h1 className="font-bold text-lg">MINISTRY OF FINANCE</h1>
            <img src="/kenya.png" alt="" height={40} width={60} className="" />
            <h2 className="text-md">PENSIONS DEPARTMENT</h2>
          </div>
          <div className="flex justify-end mb-6">
            {/* Left section */}

            {/* Right section */}
            <div className="text-right  ">
              <p className="text-sm">MINISTRY OF FINANCE</p>
              <p className="text-sm">PENSIONS DEPARTMENT</p>
              <p className="text-sm">P.O BOX 20191</p>
              <p className="text-sm">NAIROBI</p>
              <p className="text-sm">14-MAY-24</p>
            </div>
          </div>

          {/* Reference and Address */}

          <div className="mb-6">
            <p className="text-sm mb-2">
              <strong>REF:</strong> APN/PC0000406440
            </p>
            <p className="text-sm ">{report?.pensionerName}</p>
            <p className="text-sm ">P.O. Box 1734</p>
            <p className="text-sm ">NAIVASHA</p>
            <p className="text-sm ">Kenya</p>
          </div>

          {/* Letter Body */}
          <div className="mb-6">
            <p className="text-sm mb-4">Dear Pensioner,</p>
            <p className="text-sm mb-4">
              You have been awarded a pension gratuity of KShs{' '}
              {formatNumber(report?.netAmount)} and a monthly pension of KShs
              {formatNumber(report?.totalMonthlyPensionAmount)} with effect from
              08-JUL-23.
            </p>
            <p className="text-sm mb-4">
              Your monthly pension is payable in arrears and payments for the
              period 08-JUL-23 to 30-APR-24 have been included in the gratuity
              cheque. Subsequent monthly payments will follow.
            </p>
            <p className="text-sm mb-4">
              A cheque for KShs {formatNumber(report?.grossAmount)} being net
              of:
            </p>

            {/* Deductions Table */}
            <div className="ml-6">
              <ul className="text-sm list-none space-y-[2px]">
                <li className="flex justify-between">
                  <span>(i) Govt. Liability</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-[110px]">
                    KShs{' '}
                    {report?.totalLiabilityAmount
                      ? report.totalLiabilityAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>(ii) Income Tax (cap 470)</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-11">
                    KShs{' '}
                    {report?.totalTaxAmount
                      ? report.totalTaxAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>(iii) Abatement</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-[110px]">KShs .00</span>
                </li>
                <li className="flex justify-between">
                  <span>(iv) WCPS Recovery</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-[110px]">KShs .00</span>
                </li>
                <li className="flex justify-between">
                  <span>(v) With Holding Tax</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-[67px]">KShs .00</span>
                </li>
              </ul>

              <p className="text-sm mt-4">
                <li className="flex justify-between">
                  <span>ALL totaling to</span>
                  <span className="flex-grow border-dashed border-b border-black mx-2"></span>
                  <span className="mr-[67px]">
                    KShs{' '}
                    {report?.netAmount
                      ? report.netAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '0.00'}
                  </span>
                </li>
              </p>
            </div>

            <p className="text-sm mt-4">
              In respect of your gratuity/pension arrears has been sent to ABSA
              BANK ELDORET.
            </p>
            <p className="text-sm mt-4">
              Please note that NO CHANGES TO THE BANK ACCOUNT you have provided
              will be processed within SIX MONTHS from the date of this letter
              and thereafter not more than ONCE A YEAR.
            </p>
          </div>

          {/* Closing */}
          <div className="mt-8">
            <p className="text-sm">Yours faithfully,</p>
            <p className="text-sm mt-4">FOR: DIRECTOR OF PENSIONS</p>
          </div>

          {/* CC Section */}
          <div className="mt-8">
            <p className="text-sm font-bold">C.C.</p>
            <p className="text-sm">
              P-No.: 273053 <br />
              TSC - THE TEACHERS SERVICE COMMISSION <br />
              P.O Box Private Bag <br />
              MOI Avenue <br />
              NAI - NAIROBI <br />
              1000 - Nairobi Province <br />
              KE - Kenya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GratuityLetterReport;
