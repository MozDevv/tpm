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
import { parseDate } from '@/utils/dateFormatter';
//const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const DependantsReport = ({ setOpenGratuity, clickedItem }) => {
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
        filename: 'Appendix.pdf',
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
  const tableData = [
    {
      dependantNo: '5PN/PC0000362834_1',
      dependantName: 'Stella Kananu Bundi',
      relationship: 'Wife',
      dob: '10-NOV-80',
      effDate: '23-JUL-20',
      deletionDate: '23-JUL-20',
      cessationDate: '22-JUL-35',
      monthlyPension: '15,728.00',
    },
    {
      dependantNo: '5PN/PC0000362834_1',
      dependantName: 'Alponsus Muthomi',
      relationship: 'Son',
      dob: '04-AUG-09',
      effDate: '23-JUL-20',
      deletionDate: '23-JUL-20',
      cessationDate: '04-AUG-33',
      monthlyPension: '0.00',
    },
    {
      dependantNo: 'BPN/FC0000362834_1',
      dependantName: 'Stella Kananu Bundi',
      relationship: 'Wife',
      dob: '10-NOV-80',
      effDate: '23-JUL-20',
      deletionDate: '23-JUL-20',
      cessationDate: '22-JUL-35',
      monthlyPension: '9,388.00',
    },
    {
      dependantNo: 'BPN/FC0000362834_1',
      dependantName: 'Alponsus Muthomi',
      relationship: 'Son',
      dob: '04-AUG-09',
      effDate: '23-JUL-20',
      deletionDate: '23-JUL-20',
      cessationDate: '04-AUG-33',
      monthlyPension: '4,194.20',
    },
  ];
  useEffect(() => {
    console.log('clickedItem', clickedItem);
  }, [clickedItem]);

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
            Dependants Report
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
        <div ref={contentRef} className="  px-4  mx-auto courier-font ">
          <h2 className="text-xl font-bold mb-6 text-center">
            DEPENDANT COMPUTATION
          </h2>
          <div className="border border-gray-800 pb-4">
            <div className="grid grid-cols-3 pb-3 ml-3">
              <div className="">
                <p className="font-bold">Pensioner Name</p>
                <p className="text-gray-400 font-semibold">
                  {clickedItem?.first_name} {clickedItem?.other_name}{' '}
                  {clickedItem?.surname}
                </p>
              </div>
              <div className="">
                <p className="font-bold">Personal Number</p>
                <p className="text-gray-400 font-semibold">
                  {clickedItem?.personal_number}
                </p>
              </div>
              <div className="">
                <p className="font-bold">Retirement Date</p>
                <p className="text-gray-400 font-semibold">
                  {parseDate(clickedItem?.retirement_date)}
                </p>
              </div>
              <div className="">
                <p className="font-bold">Monthly Pension</p>
                <p className="text-gray-400 font-semibold">
                  {report?.monthly_pension}
                </p>
              </div>

              <div className="">
                <p className="font-bold">Unreduced Pension</p>
                <p className="text-gray-400 font-semibold">
                  {formatNumber(report?.unreduced_pension)}
                </p>
              </div>
              <div className="">
                <p className="font-bold">Death Date</p>
                <p className="text-gray-400 font-semibold">
                  {parseDate(clickedItem?.death_date)} {/*  */}
                </p>
              </div>
            </div>
            <div className="w-full pb-1">
              {/* Header */}
              <div className="grid grid-cols-[2fr,2fr,1fr,1fr,1fr,1fr,1fr,1fr] border-t border-b border-black font-bold pb-1">
                <div className=" text-start pl-1">Dependant No</div>
                <div className=" text-center">Dependant Name</div>
                <div className=" text-center">Relationship</div>
                <div className=" text-center">D.O.B</div>
                <div className=" text-center">Eff Date</div>
                <div className=" text-center">Deletion Date</div>
                <div className=" text-center">Cessation Date</div>
                <div className=" text-center">Monthly Pension</div>
              </div>

              {/* Data Rows */}
              {pensionerBenefits
                .filter((benefit) => benefit.beneficiary !== null)
                .map((benefit, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr,2fr,1fr,1fr,1fr,1fr,1fr,1fr] text-center  text-[12px]"
                  >
                    <div className="p-1 whitespace-nowrap">
                      {benefit.pensioner_award_code}
                    </div>
                    <div className="p-1 whitespace-nowrap">
                      {benefit.beneficiary?.first_name}{' '}
                      {benefit.beneficiary?.other_name}{' '}
                      {benefit.beneficiary?.surname}
                    </div>
                    <div className="p-1">
                      {benefit.beneficiary?.relationship?.name}
                    </div>
                    <div className="p-1">
                      {parseDate(benefit.beneficiary?.dob)}
                    </div>
                    <div className="p-1">
                      {parseDate(benefit.beneficiary?.created_date)}
                    </div>
                    <div className="p-1">
                      {parseDate(benefit.beneficiary?.date_of_death)}
                    </div>
                    <div className="p-1">
                      {parseDate(benefit.benefitEndDate)}
                    </div>
                    <div className="p-1">
                      {formatNumber(benefit.monthly_pension)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependantsReport;
