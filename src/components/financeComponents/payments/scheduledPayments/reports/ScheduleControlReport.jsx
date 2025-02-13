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

const ScheduleControlReport = ({ setOpenReport, id }) => {
  const { data } = useFetchAsync(
    financeEndpoints.getScheduleControlReportById(id),
    apiService
  );

  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const handleDownload = async () => {
    setLoading(true);

    const element = contentRef.current;

    // Load html2pdf.js dynamically, only in the browser
    const html2pdf = (await import('html2pdf.js')).default;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Schedule Control Report.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    const wrapper = document.createElement('div');

    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.overflow = 'hidden';

    const clonedElement = element.cloneNode(true);
    clonedElement.style.transform = 'scale(1)';
    clonedElement.style.transformOrigin = 'top left';

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
          <div className="text-center flex flex-col items-center">
            <h2 className="font-bold text-base pb-3">CENTRAL BANK OF KENYA</h2>
            <img src="/kenya.png" alt="Kenya Flag" height={40} width={70} />
            <p className="text-[14px] pb-[5px] font-bold border-b border-black inline-block">
              Schedule Control Report for EFT
            </p>
            <div className="flex w-full ">
              <table className="mt-4 text-xs grid-cols-10">
                <tbody>
                  <tr>
                    <td className="relative pb-[5px] py-[2px]">
                      <span className="relative inline-block">
                        Ministry/Department:
                        <span className="absolute left-0 right-0 bottom-[-6px] h-[1px] bg-black"></span>
                      </span>
                    </td>
                    <td className="relative pb-[5px] py-[2px]">
                      <span className="relative inline-block">
                        Code:
                        <span className="absolute left-0 right-0 bottom-[-6px] h-[1px] bg-black"></span>
                      </span>
                    </td>
                    <td className="relative pb-[5px] py-[2px]">
                      <span className="relative inline-block">
                        Ref No.
                        <span className="absolute left-0 right-0 bottom-[-6px] h-[1px] bg-black"></span>
                      </span>
                    </td>
                    <td className="relative pb-[5px] py-[2px]">
                      <span className="relative inline-block">
                        Acc. Title
                        <span className="absolute left-0 right-0 bottom-[-6px] h-[1px] bg-black"></span>
                      </span>
                    </td>
                    <td className="relative pb-[5px] py-[2px]">
                      <span className="relative inline-block">
                        Schedule No:
                        <span className="absolute left-0 right-0 bottom-[-6px] h-[1px] bg-black"></span>
                      </span>
                    </td>
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
            </div>
          </div>
          <div className="flex justify-between flex-col h-[95vh]">
            <div className="">
              <table className="min-w-full mt-4 ">
                <thead>
                  <tr>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        No
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        Name (Bank)
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        Payee (Bank)
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        EFT Status
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        EFT Date
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        EFT Number
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        Amount (Ksh.)
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                    <th className="relative py-1 text-xs">
                      <span className="relative inline-block pb-[5px]">
                        Purpose
                        <span className="absolute left-0 right-0 bottom-[-2px] h-[1px] bg-black"></span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center py-1 text-xs">
                          {index + 1}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.payeeName || '-'}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.payeeBank || '-'}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.eftStatus}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {parseDate(item.eftDate)}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.eftNo}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.amount ? item.amount.toFixed(2) : '-'}
                        </td>
                        <td className="text-center py-1 text-xs">
                          {item.purpose}
                        </td>
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
