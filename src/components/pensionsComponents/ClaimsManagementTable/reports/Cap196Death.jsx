import { downloadPdf, generatePdfBlob } from '@/utils/reportsUtils';

import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, Button, Divider, IconButton } from '@mui/material';
import { Cancel, GetApp, Refresh } from '@mui/icons-material';
import { parseDate2 } from '@/utils/dateFormatter';
const Cap196Death = ({ setOpenGP178Report, clickedItem }) => {
  const contentRef = useRef(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = () => {
    setLoading(true);
    generatePdfBlob(contentRef, setPdfBlob, setLoading);
  };

  const handleDownload = () => {
    downloadPdf(contentRef.current, setLoading);
  };

  useEffect(() => {
    handleGeneratePdf();
  }, []);

  return (
    <div className="">
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
        className="bg-white h-[80px] flex flex-row justify-between pt-2 items-center  px-4 w-full"
        style={{ boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Detailed Report
          </h2>
          <p className="text-sm text-gray-500">
            Detailed analysis and insights
          </p>
        </div>
        <div className="space-x-4">
          <IconButton onClick={handleGeneratePdf}>
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
            onClick={() => setOpenGP178Report(false)}
            variant="outlined"
            color="primary"
            startIcon={<Cancel />}
            className="px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-300"
          >
            Cancel
          </Button>
        </div>
      </div>
      {pdfBlob && (
        <iframe
          src={URL.createObjectURL(pdfBlob)}
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            display: 'none',
          }}
          title="Page 5 PDF"
        />
      )}
      <div className="">
        <div
          ref={contentRef}
          className="p-8 max-w-2xl overflow-y-auto mx-auto  font-times"
        >
          <div className="">
            <div className="text-center items-center justify-center  flex flex-col">
              <p className="uppercase font-bold text-[22px] mb-4">
                Republic of Kenya
              </p>{' '}
              <img
                src="/kenya.png"
                alt=""
                height={60}
                width={140}
                className="w-[120px] h-[100px]"
              />
            </div>

            <div className="flex justify-between items-start mb-4 mt-8">
              <div>
                <p>
                  Ref. No:{' '}
                  <span className="custom-underline font-bold">
                    88028537/163
                  </span>
                </p>
              </div>
              <div>
                <p>Date ________________________</p>
              </div>
            </div>

            <div className="mb-4">
              <div>
                <p>The Secretary</p>
                <p>Pensions Department</p>
                <p>Ministry of Finance</p>
                <p>P.O Box 30510-00100</p>
                <p>Nairobi</p>
                <p className="mt-2">Dear Sir/Madam</p>
              </div>
            </div>

            <div className="mb-[150px]">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold  ">
                  RE: PAYMENT OF DEATH GRATUITY - HON. JOSEPH NGUGI NYUMU{' '}
                  <h2 className="text-md mb-3 font-bold ml-9 custom-underline">
                    FORMER MEMBER OF PARLIAMENT
                  </h2>
                </h1>
              </div>
              <p className="mb-6">
                Enclosed herein please find the underlisted documents in respect
                of Hon. Joseph Ngugi Nyumu’s death benefits:
              </p>
              <ol className="list-decimal pl-8 ">
                <li>Schedule of his pension contributions</li>
                <li>
                  Minutes of Parliamentary Pensions Committee which approved and
                  authorised payment
                </li>
                <li>Clearance Certificate from Kenya Revenue Authority</li>
                <li>
                  Photo copy of his identification card and death certificate
                </li>
                <li>His next of kin bank details</li>
                <li>
                  Copy of the swift transfer for his contributions for March,
                  April and May 2013
                </li>
              </ol>
              <p className="mb-6 mt-4">
                I confirm that the former Member of Parliament has no Government
                liabilities.
              </p>
              <div className="mt-10">
                <p className="mb-2">Yours faithfully,</p>
                <p className="font-bold italic mb-6"></p>
                <p>
                  <span className="font-bold">Lilian N. Wata</span> <br />
                  <span>For: The Clerk of the National Assembly</span>
                </p>
              </div>
            </div>

            {/************        PART A PERSON ENTA           ******** */}
            <p className="uppercase font-bold text-[22px] mb-8 text-center">
              Republic of Kenya
            </p>
            <div className="">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p>
                    Ref. No:{' '}
                    <span className="custom-underline font-bold">
                      88028537/163
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p>Clerk of the National Assembly</p>
                  <p>Parliamentary Buildings</p>
                  <p>P.O Box 30510-00100</p>
                  <p className="custom-underline">Nairobi</p>
                  <p className="mt-3">
                    Date:{' '}
                    <span className="custom-underline">February 8, 2016</span>
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p>
                  The Permanent Secretary
                  <br />
                  Ministry of Finance
                  <br />
                  P.O Box 30007-00100
                  <br />
                  <span className="custom-underline font-semibold">
                    Nairobi
                  </span>
                </p>
              </div>

              <div className="mb-4 text-center">
                <p className="font-semibold  custom-underline text-center uppercase">
                  ( Attention: pensions department){' '}
                </p>
              </div>

              <div className="mb-4 text-center">
                <p className="font-semibold text-center text-[16px] uppercase mb-2 custom-underline">
                  Claim for the Retirement Pension or Death Gratuity
                </p>
              </div>
            </div>
            <p>
              The following particulars are furnished in support of a claim for:
            </p>

            <ul className="list-none mb-4 pl-6">
              <li className="custom-line-through">
                Unreduced(Uncommuted) Retirement Pension
              </li>
              <li className="custom-line-through">
                Reduced Retirement Pension and Gratuity
              </li>
              <li className="custom-line-through">Refund of Contributions</li>
              <li className="custom-line-through">Widows/Children Pension</li>
              <li className="custom-line-through">Death Gratuity</li>
            </ul>

            <div className="space-y-6 mb-5">
              <div className="">
                <p className="flex gap-1">
                  1. Full name of the Claimant:
                  <span className="font-semibold custom-underline">
                    {clickedItem?.first_name} {clickedItem?.surname}{' '}
                    {clickedItem?.other_name}
                  </span>
                </p>
              </div>

              <div className="">
                <p>
                  2. Payroll Number:
                  <span className="custom-underline font-semibold">
                    {clickedItem?.personal_number}
                  </span>
                </p>
              </div>

              <div className="">
                <p>
                  3. Date of Birth of Entitled Person:
                  <span className="custom-underline font-semibold">
                    {' '}
                    {parseDate2(clickedItem?.dob)}
                  </span>
                </p>
              </div>

              <div className="">
                <p>
                  4. Date first elected to office as Deputy President/Prime
                  Minister/Vice President/Speaker *:
                  <span className="custom-underline font-semibold">
                    {parseDate2(clickedItem?.date_of_first_appointment)}
                  </span>
                </p>
              </div>

              <div className="">
                <p>
                  5. Date from which Pension will commence/Date of Death*:
                  <span className="custom-underline font-semibold">
                    {' '}
                    {parseDate2(clickedItem?.retirement_date)}
                  </span>
                </p>
              </div>

              <div className="">
                <p>
                  6. Authority for payment of Claim (reference of letter from
                  executive office of the President or Clerk of the National
                  Assembly or Senate)
                  <span className="custom-underline font-semibold">
                    {clickedItem?.authority_for_retirement_reference}
                  </span>
                </p>
              </div>
            </div>

            {/************        PART C STATEMENT OF SERVICE           ******** */}

            {/* Section 7 */}
            <div className="mb-6">
              <p className="font-semibold mb-2 mt-10">
                7. Detail of Claimant’s Spouse
                <span className="italic">
                  {' '}
                  (applicable where Spouse(s) benefits are to be paid)
                </span>
                :
              </p>

              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2">a. Name(s):</p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2"> b. ID Numbers:</p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2"> c. Address:</p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <p className="font-semibold mb-2">
                8. Detail of Claimant’s Children
                <span className="italic">
                  {' '}
                  (applicable where Children benefits are to be paid)
                </span>
                :
              </p>

              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2">a. Name(s):</p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2">
                    {' '}
                    b. ID Numbers:{' '}
                    <span className="italic custom-underline">
                      (where applicable; if a child is a minor, ID Number of
                      parent/guardian to be indicated)
                    </span>
                  </p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <p className="mr-2"> c. Address:</p>
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2 mt-12">
                9. Full name and address of deceased officers legal person
                representative(s)
              </p>
              <span className="italic">
                (applicable to death gratuity where the claimant has no spouse)
              </span>

              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1 mt-12">
                10.Detauks of the last monthly salary of the entitled person:
              </p>
              <span className="italic">
                (where applicable indicate 60% of the last monthly salary
                approved by the SRC)
              </span>

              <div className="mb-6">
                <div className="pl-4 flex items-center">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
                <div className="pl-4 flex items-center mt-2">
                  <div className="flex-grow border-b border-gray-800 h-6"></div>
                </div>
              </div>
            </div>

            {/* <div className="mt-[160px] space-y-3 mb-[60px]">
          <p className="uppercase custom-underline font-bold text-[23px] mb-4">
            Payroll Reinstatement Form
          </p>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center">
              <p className=" font-medium">PENSION NO</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
            <div className="flex items-center">
              <p className="">NAME</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex items-center">
              <p className=" font-medium">DATE DELETED</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
            <div className="flex items-center">
              <p className="">AMOUNT</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">REASON</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">PREVIOUS PAYPOINT BANK/CODE</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
            <div className="flex items-center mt-2">
              <p className=" font-medium w-[120px]"></p>
              <p className=" font-medium">ACCOUNT NO</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>

          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">RE-INTRODUCTION DATED</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">AMOUNT</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">CURRENT PAYPOINT BANK/CODE</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <p className=" font-medium">CURRENT ACCOUNT NO.</p>
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <div className="flex-grow border-b-[3px] border-gray-800 h-4 border-dotted"></div>
            </div>
          </div>
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cap196Death;
