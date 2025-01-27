import useFetchAsync from '@/components/hooks/DynamicFetchHook';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import React from 'react';
import { Backdrop, Button, IconButton } from '@mui/material';
import { Cancel, GetApp, Refresh } from '@mui/icons-material';
import { useState } from 'react';
import { Empty } from 'antd';
import html2pdf from 'html2pdf.js';
import { useEffect } from 'react';
import { useRef } from 'react';
import { parseDate } from '@/utils/dateFormatter';

const ScheduleControlReport = ({ setOpenReport }) => {
  const { data } = useFetchAsync(
    financeEndpoints.getScheduleControlReport,
    apiService
  );

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
      filename: 'ScheduleControlReport.pdf',
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

  const generatePdfBlob = () => {
    setTimeout(() => {
      const element = contentRef.current;

      // Define fixed dimensions for the content (in pixels)
      const fixedWidth = 770; // Width in pixels
      const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

      // Define options for the PDF
      const options = {
        margin: 0.5, // Default margin (in inches)
        filename: 'ScheduleControlReport.pdf',
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
    if (data) {
      setTimeout(() => {
        generatePdfBlob();
      }, 100);
    }
  }, [data]);
  return (
    <div
      className="flex-grow"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div
        className="bg-white h-[80px] flex flex-row justify-between pt-2 items-center  px-4 w-full"
        style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Schedule Control Report
          </h2>
          <p className="text-sm text-gray-500">
            Detailed analysis and insights
          </p>
        </div>
        <div className="space-x-4">
          <IconButton onClick={generatePdfBlob}>
            <Refresh />
          </IconButton>
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
            onClick={() => setOpenReport(false)}
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
          title="Tax Report"
        />
      ) : (
        <div className="flex items-center justify-center min-h-[65vh]">
          <div className="text-center">
            <Empty description="No PDF available to display." />
          </div>
        </div>
      )}
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
      <div className="hidden">
        <div ref={contentRef} className="p-4 max-w-screen-lg mx-auto font-sans">
          <div className="text-center">
            <h2 className="font-bold text-base">CENTRAL BANK OF KENYA</h2>
            <p className="text-xs underline">Schedule Control Report for EFT</p>
            <div className="flex w-full ">
              <table className="mt-4 text-xs grid-cols-10">
                <tbody>
                  <tr>
                    <td className="underline px-2 py-[2px]">
                      Ministry/Department:
                    </td>
                    <td className="underline px-2 py-[2px]">Code:</td>
                    <td className="underline px-2 py-[2px]">Ref No.</td>
                    <td className="underline px-2 py-[2px]">Acc. Title</td>
                    <td className="underline px-2 py-[2px]">Schedule No:</td>
                  </tr>
                  <tr>
                    <td className="px-7">Ministry of Education</td>
                    <td className="px-7">122128981</td>
                    <td className="px-7">--</td>
                    <td className="px-7">RECURRENT VOTE</td>
                    <td className="px-7">475656</td>
                  </tr>
                </tbody>
              </table>
              <img
                src="/kenya.png"
                alt="Kenya Flag"
                height={40}
                width={70}
                className="grid-cols-2"
              />
            </div>
          </div>
          <div className="flex justify-between flex-col h-[95vh]">
            <div className="">
              <table className="min-w-full mt-4 ">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-xs underline">No</th>
                    <th className="px-2 py-1 text-xs underline">Name (Bank)</th>
                    <th className="px-2 py-1 text-xs underline">
                      Payee (Bank)
                    </th>
                    <th className="px-2 py-1 text-xs underline">EFT Status</th>
                    <th className="px-2 py-1 text-xs underline">EFT Date</th>
                    <th className="px-2 py-1 text-xs underline">EFT Number</th>
                    <th className="px-2 py-1 text-xs underline">
                      Amount (Ksh.)
                    </th>
                    <th className="px-2 py-1 text-xs underline">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-2 py-1 text-xs">{index + 1}</td>
                        <td className="px-2 py-1 text-xs">
                          {item.payeeName || '-'}
                        </td>
                        <td className="px-2 py-1 text-xs">
                          {item.payeeBank || '-'}
                        </td>
                        <td className="px-2 py-1 text-xs">{item.eftStatus}</td>
                        <td className="px-2 py-1 text-xs">
                          {parseDate(item.eftDate)}
                        </td>
                        <td className="px-2 py-1 text-xs">{item.eftNo}</td>
                        <td className="px-2 py-1 text-xs">
                          {item.amount ? item.amount.toFixed(2) : '-'}
                        </td>
                        <td className="px-2 py-1 text-xs">{item.purpose}</td>
                      </tr>
                    ))}

                  {/* Total Row */}
                  <tr className="mt-4">
                    <td className="px-2 py-1 text-xs font-bold" colSpan={6}>
                      Total
                    </td>
                    <td className="px-2 py-1 text-xs font-bold">
                      {data
                        ? data
                            .reduce(
                              (total, item) => total + (item.amount || 0),
                              0
                            )
                            .toFixed(2)
                        : '0.00'}
                    </td>
                    <td className="px-2 py-1 text-xs"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex w-full justify-between">
              <div className="text-xs">
                <p className="font-semibold">
                  Checked and Confirmed By Head/Deputy Head
                </p>
                <p>Name: _____________________________________</p>
                <p>Signature: _________________________________</p>
                <p>Date:_________________________________________</p>
              </div>
              <div className="text-xs">
                <p className="font-semibold">Delivered By</p>
                <p>Name: _____________________________________</p>
                <p>Signature: _________________________________</p>
                <p>Date:_________________________________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleControlReport;
