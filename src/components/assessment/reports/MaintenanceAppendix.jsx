import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Button, IconButton } from '@mui/material';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import { useAuth } from '@/context/AuthContext';
import { formatNumber } from '@/utils/numberFormatters';
import { Cancel, GetApp, Refresh } from '@mui/icons-material';
import { Empty } from 'antd';
import authEndpoints, { AuthApiService } from '@/components/services/authApi';
//const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const MaintenanceAppendix = ({
  setOpenGratuity,
  clickedItem,
  clickedBenefit,
}) => {
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
      filename: 'Appendix.pdf',
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

  const [pensionerBenefits, setPensionerBenefits] = useState([]);

  const fetchPVReport = async () => {
    setLoading(true);
    try {
      const [calculationSummaryRes, pensionableServiceRes, pensionerBenefits] =
        await Promise.all([
          assessApiService.get(
            assessEndpoints.getCalculationSummary(clickedItem.id_claim)
          ),
          assessApiService.get(
            assessEndpoints.getClaimPensionableService(clickedItem.id_claim)
          ),
          assessApiService.get(
            assessEndpoints.getPensionerBenefits(clickedItem?.id_claim)
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
      if (pensionerBenefits.data.succeeded) {
        console.log('Pensioner Benefits:', pensionerBenefits.data.data);
        setPensionerBenefits(pensionerBenefits.data.data);
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
        filename: 'Maintenance Appendix.pdf',
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

    console.log('this is the clicked item', clickedItem);
  }, [report, pensionableService]);

  /**  "prospectivePensionerAwards": [
    {
      "prospective_pensioner_id": "fc3beb7c-f22b-4f48-b91d-d19428fd978c",
      "pension_award_id": "c85ffa52-1519-464b-9fad-a2b3362cfb2b",
      "pension_award": {
        "id": "c85ffa52-1519-464b-9fad-a2b3362cfb2b",
        "pension_cap_id": "3be49117-74d7-428b-b4b3-25a836109927",
        "prefix": "APN/PC",
        "code": 33,
        "has_commutation": false,
        "name": "RETIREMENT ON AGE GROUNDS GRATUITY",
        "description": "Retirement On Age Grounds Gratuity",
        "start_date": null,
        "end_date": null
      },
      "is_active": true,
      "id": "0b8f798a-d75f-4469-b211-38892d646b53",
      "created_by": "1677f2b9-99d3-41f8-ad74-dba8c777180f",
      "created_date": "2025-02-03T04:41:38.862817Z",
      "updated_by": null,
      "updated_date": null
    },
    {
      "prospective_pensioner_id": "fc3beb7c-f22b-4f48-b91d-d19428fd978c",
      "pension_award_id": "f8cff874-b5fa-4e41-80bc-f9edb6dbbefa",
      "pension_award": {
        "id": "f8cff874-b5fa-4e41-80bc-f9edb6dbbefa",
        "pension_cap_id": "3be49117-74d7-428b-b4b3-25a836109927",
        "prefix": "APN/PC",
        "code": 0,
        "has_commutation": true,
        "name": "RETIREMENT ON AGE GROUNDS PENSION",
        "description": "Retirement On Age Grounds Pension",
        "start_date": null,
        "end_date": null
      },
      "is_active": true,
      "id": "5eec9557-4504-4a9d-a25d-404925362f99",
      "created_by": "1677f2b9-99d3-41f8-ad74-dba8c777180f",
      "created_date": "2025-02-03T04:41:38.862813Z",
      "updated_by": null,
      "updated_date": null
    }
  ],
   */

  /**
   * FOR MAINTENANCE REPORT CHANGE MONTHLY PENSION AND GRATUIT
   *
   *
   */

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
            Maintenance Appendix Report
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
              generatePdfBlob();
            }}
          >
            <Refresh />
          </IconButton>
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
        <div ref={contentRef} className="  max-w-3xl mx-auto ">
          <div className="flex flex-col min-h-screen  font-sans word-spacing  text-[11px] bg-white text-black max-w-4xl mx-auto ">
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
                  Maintenance Pensioner Number Benefit Computation Appendix
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 font-semibold ">
                {pensionerBenefits
                  ?.filter((item) => !item.beneficiary && !item.maintenance)
                  .map((item, index) => (
                    <p>
                      Pension Number:{' '}
                      <strong className="font-normal ml-3">
                        {clickedBenefit?.pensioner_number}
                      </strong>
                    </p>
                  ))}
              </div>
              <div className="font-semibold">
                <p>
                  Pensioner Name:{' '}
                  <strong className="font-normal ml-3">
                    {clickedBenefit?.maintenance?.maintainee_name}
                  </strong>
                </p>
              </div>
            </div>

            {/* Pensionable Service In Months */}
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <strong className="w-1/2">Pension Emoluments:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.pensionable_emolument)}
                    </span>
                  </div>{' '}
                  <div className="flex justify-between">
                    <strong className="w-1/2">Unreduced Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.unreduced_pension)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Reduced Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.reduced_pension)}
                    </span>
                  </div>{' '}
                  <div className="flex justify-between">
                    <strong className="w-1/2">Gratuity/Lumpsum:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(clickedBenefit?.lumpsum_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="w-1/2">Current Salary:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(report?.current_salary)}
                    </span>
                  </div>{' '}
                  <div className="flex justify-between">
                    <strong className="w-1/2">Monthly Pension:</strong>
                    <span className="w-1/2 text-right">
                      {formatNumber(clickedBenefit?.monthly_pension)}
                    </span>
                  </div>{' '}
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
            <div className="py-4 mt-auto">
              <div className="flex gap-1 px-4">
                <strong>Signature And Date Of Chief Pensions Officer</strong>
                <div className="border-b border-gray-800 flex-grow h-7"></div>
              </div>
              <div className="flex flex-row gap-8 px-4">
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
    </div>
  );
};

export default MaintenanceAppendix;
