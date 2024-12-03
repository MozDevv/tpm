import { generatePdfBlob } from '@/utils/reportsUtils';
import { Divider } from '@mui/material';
import React, { useRef, useState } from 'react';

const DsoReport = () => {
  const contentRef = useRef(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = () => {
    setLoading(true);
    generatePdfBlob(contentRef, setPdfBlob, setLoading);
  };
  return (
    <div className="p-8 max-w-2xl overflow-y-auto mx-auto border border-gray-300 font-times">
      <div className="">
        <div className="text-center items-center justify-center  flex flex-col">
          <img
            src="/kenya.png"
            alt=""
            height={60}
            width={140}
            className="w-[120px] h-[100px]"
          />

          <p className="uppercase font-bold text-[22px] mb-4">
            Republic of Kenya
          </p>
          <p className="font-bold uppercase text-[20px] px-7">
            The Retirement Benefits (Deputy President and Designated State
            Officers) Act
          </p>
          <p className="italic mt-4">(Act No. 8 of 2015)</p>
        </div>

        <Divider
          sx={{
            backgroundColor: '#000',
            height: 3,
            marginBottom: '1rem',
          }}
        />

        <div className="flex justify-between items-start mb-4">
          <div>
            <p>
              Ref. No: <span className="underline font-bold">88028537/163</span>
            </p>
          </div>
          <div>
            <p>Executive Office of the President</p>
            <p>P.O Box 30510-00100</p>
            <p>Nairobi</p>
            <p className="mt-2">
              Date: <span className="underline">February 8, 2016</span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p>
            To: The Permanent Secretary/The National Treasury
            <br />
            P.O Box 30007-00100
            <br />
            <span className="underline font-semibold">Nairobi</span>
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold underline">
            For the attention of: Pensions Secretary/Director of Pensions
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold  text-[16px] uppercase mb-2 ">
            Claim for the Retirement Pension or Death Gratuity
          </p>
          <p>
            The following particulars are furnished in support of a claim for
            award under the provision of the Retirement Benefits (Deputy
            President and Designated State Officers) Act (ACT No. 8 OF 2015):
          </p>
        </div>

        <ul className="list-none mb-4">
          <li className="line-through">*Unreduced Retirement Pension</li>
          <li>*Reduced Retirement Pension and Gratuity</li>
          <li className="line-through">*Death Gratuity</li>
        </ul>

        <p className="italic text-left"></p>

        {/************        PART A PERSON ENTA           ******** */}

        <div className="mt-[60px]">
          <p className="uppercase font-bold">
            Part A - Person Entitled to Benefits{' '}
            <span className="italic">(w.e.f 1st January, 1993):</span>
          </p>
          <p className="italic text-left w-full"></p>
        </div>

        <ul className="list-none mb-6 space-y-1 mt-5">
          <li className="line-through">a) Retired Deputy President *</li>
          <li className="line-through">b) Retired Prime Minister *</li>
          <li>c) Retired Vice-President *</li>
          <li className="line-through">d) Retired Speaker *</li>
          <li className="line-through">
            e) Spouse/Child/Legal Personal Representative of a, b, c, or d *
          </li>
        </ul>

        {/************        PART B STATEMENT OF PARTICULARS           ******** */}

        <div className="mb-4 mt-5">
          <p className="uppercase font-bold">
            Part B - Statement of Particulars
          </p>
          <div className="mr-0"></div>
        </div>

        <div className="space-y-6">
          <div className="">
            <p>
              1. Full name of Entitled Person:
              <span className="font-semibold underline">
                Hon. Stephen Kalonzo Musyoka
              </span>
            </p>
          </div>

          <div className="">
            <p>
              2. Personal Number/Identification Number of Entitled Person:
              <span className="underline font-semibold"> 8932417</span>
            </p>
          </div>

          <div className="">
            <p>
              3. Date of Birth of Entitled Person:
              <span className="underline font-semibold"> 24/12/1953</span>
            </p>
          </div>

          <div className="">
            <p>
              4. Date first elected to office as Deputy President/Prime
              Minister/Vice President/Speaker *:
              <span className="underline font-semibold"> January 2008</span>
            </p>
          </div>

          <div className="">
            <p>
              5. Date from which Pension will commence/Date of Death*:
              <span className="underline font-semibold"> 1st April 2013</span>
            </p>
          </div>

          <div className="">
            <p>
              6. Authority for payment of Claim (reference of letter from
              executive office of the President or Clerk of the National
              Assembly or Senate)
              <span className="underline font-semibold">
                {' '}
                Ref No. 88028537/164
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
                <span className="italic underline">
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
            (where applicable indicate 60% of the last monthly salary approved
            by the SRC)
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
          <p className="uppercase underline font-bold text-[23px] mb-4">
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
  );
};

export default DsoReport;
