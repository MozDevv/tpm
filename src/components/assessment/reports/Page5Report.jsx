import React, { useEffect, useRef, useState } from 'react';
import { Backdrop } from '@mui/material';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import { useAuth } from '@/context/AuthContext';
import { formatNumber } from '@/utils/numberFormatters';
//const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const Page5Report = ({ setOpenGratuity, clickedItem }) => {
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const { auth } = useAuth();

  const [pensionableService, setPensionableService] = useState([]);

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
      const [calculationSummaryRes, pensionableServiceRes] = await Promise.all([
        assessApiService.get(
          assessEndpoints.getCalculationSummary(clickedItem.id_claim)
        ),
        assessApiService.get(
          assessEndpoints.getClaimPensionableService(clickedItem.id_claim)
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
        filename: 'Gratuity_Letter.pdf',
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
          setLoading(false);
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
      {pdfBlob && (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{ width: '100%', height: '100vh', border: 'none' }}
          title="Page 5 PDF"
        />
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
      <div
        style={{
          display: 'none',
        }}
      >
        <div ref={contentRef} className="  p-4 max-w-3xl mx-auto ">
          <div className="p-8 font-sans word-spacing  text-[11px] bg-white text-black max-w-4xl mx-auto ">
            <div className="text-center mx-auto flex flex-col items-center font-sans mb-4">
              <h1 className="font-bold text-base">MINISTRY OF FINANCE</h1>
              <img
                src="/kenya.png"
                alt=""
                height={40}
                width={60}
                className=""
              />
              <h2 className="text-base font-bold">PENSIONS DEPARTMENT</h2>
              <div className="border-b-2 border-black pb-1">
                <h2 className="font-bold text-base text-center">
                  Pensions Benefit Computation Appendix
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2 font-semibold ">
                <p>
                  Pension Number:{' '}
                  <strong className="font-normal ml-3">
                    {clickedItem?.claim_id}
                  </strong>
                </p>
                <p>
                  Ministry/Department:{' '}
                  <strong className="font-normal ml-3">
                    {clickedItem?.mda_description}
                  </strong>
                </p>

                {clickedItem?.prospectivePensionerAwards.length > 0 &&
                  clickedItem?.prospectivePensionerAwards?.map((award) => (
                    <p key={award.id}>
                      Claim Type:
                      <strong className="font-normal ml-3">
                        {' '}
                        {award.pension_award?.prefix}
                      </strong>
                    </p>
                  ))}
              </div>
              <div className="font-semibold">
                <p>
                  Pensioner Name:{' '}
                  <strong className="font-normal ml-3">
                    {clickedItem?.first_name} {clickedItem?.surname}
                  </strong>
                </p>
              </div>
            </div>

            {/* Qualifying Service */}
            <div className="mt-4">
              <h2 className="font-semibold   ">Qualifying Service</h2>

              <div className="flex flex-row justify-between mt-2">
                <div className="text-center">
                  <p className="font-semibold">Date Of Joining:</p>
                  <p className="text-gray-700">
                    {new Date(
                      report?.qualifying_service_date_of_joining
                    ).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Date Of Leaving:</p>
                  <p className="text-gray-700">
                    {new Date(
                      report?.qualifying_service_date_of_leaving
                    ).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Years:</p>
                  <p className="text-gray-700">
                    {report?.qualifying_service_years}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Months:</p>
                  <p className="text-gray-700">
                    {report?.qualifying_service_months}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Days:</p>
                  <p className="text-gray-700">
                    {report?.qualifying_service_days}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Cumulative Months:</p>
                  <p className="text-gray-700">
                    {report?.qualifying_service_cumulative_months}
                  </p>
                </div>
              </div>
            </div>

            {/* Pensionable Service */}
            {/* Pensionable Service */}
            <div className="mt-4">
              <h2 className="font-bold mb-2">Pensionable Service</h2>

              <table className="w-full border-collapse text-center ml-[-15px]">
                <thead>
                  <tr>
                    <th className="py-1 w-18">From Date</th>
                    <th className="py-1 w-18">To Date</th>
                    <th className="py-1 w-22">Employment Type</th>
                    <th className="py-1 w-[90px]"></th>
                    <th className="py-1 w-[90px]"></th>
                    <th className="py-1 w-[90px]"></th>
                    <th className="py-1 w-[90px]"></th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {pensionableService?.map((service) => (
                    <tr key={service.id}>
                      <td className="py-1 text-gray-700">
                        {new Date(service.from_date).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </td>
                      <td className="py-1 text-gray-700">
                        {new Date(service.to_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-1 text-gray-700">(full)</td>
                      <td className="py-1 text-gray-700">
                        {service.pensionable_service_years}
                      </td>
                      <td className="py-1 text-gray-700">
                        {service.pensionable_service_months}
                      </td>
                      <td className="py-1 text-gray-700">
                        {service.pensionable_service_days}
                      </td>
                      <td className="py-1 text-gray-700">
                        {service.pensionable_service_cumulative_months}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-1">Total</td>
                    <td colSpan="2" className="py-1"></td>
                    <td className="py-1 text-gray-700">
                      {pensionableService?.total_years}
                    </td>
                    <td className="py-1 text-gray-700">
                      {pensionableService?.total_months}
                    </td>
                    <td className="py-1 text-gray-700">
                      {pensionableService?.total_days}
                    </td>
                    <td className="py-1 text-gray-700">
                      {pensionableService?.total_cumulative_months}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pensionable Service In Months */}
            <div className="mt-4">
              <h2 className="font-bold mb-2">Pensionable Service In Months</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <strong className="w-1/2">Current Salary:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.current_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Last 3year Total Sal:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.last_3year_total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Average Salary:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.average_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Max Govt Salary:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.max_government_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Pension Emoluments:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.pensionable_emolument)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Undreduced Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.unreduced_pension)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Reduced Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.reduced_pension)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Gratuity/Lumpsum:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.lumpsum_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Monthly Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.monthly_pension)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Abatement:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.abatement)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
              <div className="flex gap-1">
                <strong>Signature And Date Of Chief Pensions Officer</strong>
                <div className="border-b border-gray-800 flex-grow h-7"></div>{' '}
              </div>
              <div className="flex flex-row gap-8">
                <p className="mt-2 flex gap-2">
                  Created by: <strong>{auth?.user?.name}</strong>
                </p>
                <p className="mt-2 flex gap-2">
                  Date: <strong>{new Date().toLocaleDateString()}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white h-[120px] mb-[-30px] flex justify-between items-center absolute bottom-3 px-4 w-full"
        style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Download PDF
        </button>
        <button
          onClick={() => setOpenGratuity(false)} // Assuming this is the cancel action
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Page5Report;
