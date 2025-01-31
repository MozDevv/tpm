import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Button } from '@mui/material';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import { useAuth } from '@/context/AuthContext';
import { formatNumber, numberToWords } from '@/utils/numberFormatters';
import dayjs from 'dayjs';
import { Cancel, GetApp } from '@mui/icons-material';
import { Empty } from 'antd';
import { formatDateToDayMonthYear } from '@/utils/dateFormatter';
//const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const Page5Report = ({ setOpenGratuity, clickedItem }) => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const { auth } = useAuth();

  const [pensionableService, setPensionableService] = useState([]);
  const [pensionerBenefits, setPensionerBenefits] = useState([]);

  const handleDownload = async () => {
    setLoading(true);

    const element = contentRef.current;

    // Load html2pdf.js dynamically, only in the browser
    const html2pdf = (await import('html2pdf.js')).default;

    const fixedWidth = 750; // Reduced width in pixels
    const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

    const options = {
      margin: 0.5, // Default margin (in inches)
      filename: 'Page 5.pdf',
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
  const fetchPVReport = async () => {
    setLoading(true);
    try {
      const [calculationSummaryRes, pensionableServiceRes, pensionerBenefits2] =
        await Promise.all([
          assessApiService.get(
            assessEndpoints.getCalculationSummary(clickedItem.id_claim)
          ),
          assessApiService.get(
            assessEndpoints.getClaimPensionableService(clickedItem.id_claim)
          ),
          assessApiService.get(
            assessEndpoints.getPensionerBenefits(clickedItem.id_claim)
          ),
        ]);

      if (calculationSummaryRes.data.succeeded) {
        console.log('Report:', calculationSummaryRes.data.data);
        setReport(calculationSummaryRes.data.data);
      }

      if (pensionableServiceRes.data.succeeded) {
        console.log('Pensionable Service:', pensionableServiceRes.data.data);
        setPensionableService(pensionableServiceRes.data.data);
      }
      if (pensionerBenefits2.data.succeeded) {
        console.log('Pensioner Benefits:', pensionerBenefits2.data.data);
        setPensionerBenefits(pensionerBenefits2.data.data[0]);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPVReport();
  }, []);

  const generatePdfBlob = async () => {
    setLoading(true);
    setTimeout(async () => {
      const element = contentRef.current;

      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default;

      // Define fixed dimensions for the content (in pixels)
      const fixedWidth = 770; // Width in pixels
      const fixedHeight = 1123; // A4 height in pixels (11.69 inches * 96 DPI)

      // Define options for the PDF
      const options = {
        margin: 0.5, // Default margin (in inches)
        filename: 'Page 5.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };

      // Create a wrapper to hold the cloned content
      const wrapper = document.createElement('div');

      wrapper.style.position = 'relative';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.overflow = 'hidden';

      const clonedElement = element.cloneNode(true);
      const scale = 0.99; // Scale factor to reduce the size
      clonedElement.style.transform = `scale(${scale})`;
      clonedElement.style.transformOrigin = 'top left';

      wrapper.appendChild(clonedElement);

      html2pdf()
        .set(options)
        .from(wrapper)
        .outputPdf('blob')
        .then((pdfBlob) => {
          setPdfBlob(pdfBlob);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 100); // Adjust the delay as needed
  };
  useEffect(() => {
    if (report && pensionableService) {
      // Add a small delay to ensure the DOM is fully updated
      setTimeout(() => {
        generatePdfBlob();
      }, 100); // Adjust the delay as needed
    }
  }, [report, pensionableService]);

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
      )}

      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 99999 }}
          open={open}
          onClick={() => setLoading(false)}
        >
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
        <div ref={contentRef} className="p-4 max-w-3xl mx-auto overflow-auto ">
          <div className="py-8 text-sm font-sans border border-black max-w-2xl mx-auto ">
            <div className="border-b border-black px-2 ">
              <p className="mb-2 mr-1">
                I certify that the pensions/Gratuity which may be paid to the
                officer/Legal personal Representative in accordance with the
                pensions Act, as amended and the Pensions Regulations now in
                force amounts to Ksh.
                <span className="inline gap-1">
                  <span className="font-bold mr-1">
                    {' '}
                    {formatNumber(report?.lumpsum_amount || 0, 2)}
                  </span>
                  per year commencing from
                  <span className="font-bold ml-1">
                    {formatDateToDayMonthYear(
                      clickedItem?.date_from_which_pension_will_commence
                    )}
                  </span>
                </span>
              </p>
              <p className="mb-2">
                As he exercised the option for Reduced Pension and Gratuity, the
                reduced pension Amounts to Ksh.{' '}
                <span className="font-bold">
                  {formatNumber(report?.reduced_pension || 0, 2)}
                </span>
                per year with a gratuity of Ksh.{' '}
                <span className="font-bold">
                  {formatNumber(report?.lumpsum_amount || 0, 2)}
                </span>
              </p>
              <div className="py-3 flex w-full justify-between relative">
                <p className="absolute bottom-4">
                  Date:{' '}
                  <span className="font-bold ">
                    {formatDateToDayMonthYear(new Date())}
                  </span>
                </p>
                <div className=""></div>
                <div className="flex flex-col gap-1">
                  <div className="border-b border-gray-800 h-7"></div>
                  <p className="text-right font-bold">
                    Chief Pensions Officer
                  </p>{' '}
                </div>
              </div>
            </div>

            <div className="border-b border-black p-2">
              <p className="font-semibold">
                THE CONTROLLER AND AUDITOR-GENERAL,
              </p>
              <p>NAIROBI.</p>
              <p>Forwarded for favour of verification and return.</p>
              <div className="py-1 flex w-full justify-between relative">
                <p className="absolute bottom-2">
                  Date:{' '}
                  <span className="font-bold ">
                    {formatDateToDayMonthYear(new Date())}
                  </span>
                </p>
                <div className=""></div>
                <div className="flex flex-col gap-1">
                  <div className="border-b border-gray-800 h-7"></div>
                  <p className="text-right font-bold">
                    Chief Pensions Officer
                  </p>{' '}
                </div>
              </div>
            </div>

            <div className="border-b px-2 pt-1 border-black pb-2">
              <p className="font-semibold">SECRETARY/DIRECTOR OF PENSIONS,</p>
              <p className="font-semibold">PENSIONS DEPARTMENT, TREASURY,</p>
              <p>Computation Agreed.</p>

              <p>
                Ref No:{' '}
                <span className="font-bold">
                  {pensionerBenefits?.pensioner_award_code}
                </span>
              </p>
              <div className="py-1 flex w-full justify-between relative">
                <p className="absolute bottom-2">
                  Date:{' '}
                  <span className="font-bold ">
                    {formatDateToDayMonthYear(new Date())}
                  </span>
                </p>
                <div className=""></div>
                <div className="flex flex-col gap-1">
                  <div className="border-b border-gray-800 h-7"></div>
                  <p className="text-right font-bold">
                    Controller and Auditor-General
                  </p>{' '}
                </div>
              </div>
            </div>

            <div className="px-2 pt-2 border-black p">
              <p className="font-bold text-center mb-1">AWARD APPROVED</p>
              <p className="font-semibold">CHIEF ACCOUNT (PENSIONS)</p>
              <p>
                A reduced pension{' '}
                <span className="font-bold uppercase">
                  {numberToWords(report?.reduced_pension || 0, 2)}
                </span>{' '}
              </p>
              <p className="my-2">
                W.E.F. <span className="font-bold">01-JUL-22</span>
              </p>
              <p>
                Together with a Gratuity{' '}
                <span className="font-bold uppercase">
                  {numberToWords(report?.lumpsum_amount || 0)}
                </span>{' '}
              </p>
              <p className="mt-4 gap-2  flex">
                <span className="underline">Income Tax</span>
                <span className="font-bold uppercase">
                  {numberToWords(pensionerBenefits?.lumpsum_tax_amount || 0)}
                </span>
              </p>
              <p className="mt-1 gap-2 flex ">
                <span className="underline">Refund</span>
                <span className="font-bold">ZERO Shillings</span>
              </p>
              <div className="py-1 flex w-full justify-between relative">
                <p className="absolute bottom-2">
                  Date:{' '}
                  <span className="font-bold ">
                    {formatDateToDayMonthYear(new Date())}
                  </span>
                </p>
                <div className=""></div>
                <div className="flex flex-col gap-1">
                  <div className="border-b border-gray-800 h-7"></div>
                  <p className="text-right font-bold">
                    Director of Pensions, Treasury
                  </p>{' '}
                </div>
              </div>
            </div>

            <div className="px-2">
              <p>COPY TO:</p>
              <p>
                The Accounting Officer, P/S{' '}
                <span className="font-bold">
                  THE TEACHERS SERVICE COMMISSION
                </span>
              </p>
              <p className="flex gap-2 my-1">
                Mr./Miss/Mrs.{' '}
                <span className="font-bold mr-4">
                  NANCY JEPEKEMBOI KABUTEI--
                </span>{' '}
                PO Box <span className="font-bold">14</span>
              </p>
              <p className="flex space-x-2">
                <span>MARIGAT,</span>
                <span>Rift Valley Province,</span>
                <span>Kenya</span>
              </p>
            </div>
          </div>
          <div className=" pt-4 text-xs flex justify-between ">
            <p>
              Printed By: <span className="font-bold">{auth?.user?.name}</span>
            </p>
            <p>
              Date:{' '}
              <span className="font-bold">
                {dayjs().format('DD-MMM-YY HH:mm:ss')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page5Report;
