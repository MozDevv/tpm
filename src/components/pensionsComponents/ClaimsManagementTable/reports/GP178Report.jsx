import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';

import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import { Backdrop, Button, Divider } from '@mui/material';
import { Cancel, GetApp } from '@mui/icons-material';
import { Empty } from 'antd';
import React, { useEffect, useRef } from 'react';

const GP178Report = ({ retireeId, clickedItem, setOpenGP178Report }) => {
  const [retiree, setRetiree] = React.useState({});
  const [postAndNatureData, setPostAndNatureData] = React.useState([]);
  const [periodsOfAbsence, setPeriodsOfAbsence] = React.useState([]);
  const [pensionableSalary, setPensionableSalary] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [hasReviewPeriods, setHasReviewPeriods] = React.useState(false);
  const [qualifyingService, setQualifyingService] = React.useState([]);
  const [pensionableService, setPensionableService] = React.useState([]);
  const [pdfBlob, setPdfBlob] = React.useState(null);

  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(retireeId)
      );
      const retiree = res.data.data[0];

      const parseDate = (date) => {
        if (date) {
          return new Date(date).toISOString().split('T')[0];
        }
        return '';
      };

      setRetiree({
        personal_number: retiree?.personal_number ?? '',
        first_name: retiree?.first_name ?? '',
        surname: retiree?.surname ?? '',
        other_name: retiree?.other_name ?? '',
        full_name:
          retiree?.first_name +
          ' ' +
          retiree?.surname +
          ' ' +
          retiree?.other_name,
        dob: retiree?.dob
          ? new Date(retiree.dob).toISOString().split('T')[0]
          : '',
        gender: retiree?.gender ?? '',
        postal_code: retiree?.postal_code ?? '',
        notification_status: retiree?.notification_status ?? '',

        identifier_type: retiree?.identifier_type ?? '',
        national_id: retiree?.national_id ?? '',
        kra_pin: retiree?.kra_pin ?? '',
        designation_grade: retiree?.designation_grade ?? '',
        mortality_status: retiree?.mortality_status ?? '',
        marital_status: retiree?.marital_status ?? '',
        email_address: retiree?.email_address ?? '',
        postal_address: retiree?.postal_address ?? '',
        postal_code: retiree?.postal_code_id ?? '',
        phone_number: retiree?.phone_number ?? '',
        grade_id: retiree?.grade_id ?? '',
        designation_id: retiree?.designation_id ?? '',
        designation_name: retiree?.designation.name,
        ministry_department_name: retiree?.designation.mda.name ?? '',

        country_id:
          retiree?.country?.id ?? '94ece052-7142-477a-af0f-c3909402d247',
        county_id: retiree?.constituency?.county_id ?? '',
        constituency_id: retiree?.constituency?.constituency_name ?? '',
        city_town: retiree?.city_town ?? '',
        pension_award_id: retiree?.pensionAward?.id ?? '',
        date_of_first_appointment: retiree?.date_of_first_appointment
          ? new Date(retiree.date_of_first_appointment)
              .toISOString()
              .split('T')[0]
          : '',
        date_of_confirmation: retiree?.date_of_confirmation
          ? new Date(retiree.date_of_confirmation).toISOString().split('T')[0]
          : '',
        authority_for_retirement_reference:
          retiree?.authority_for_retirement_reference ?? '',
        authority_for_retirement_dated: retiree?.authority_for_retirement_dated
          ? new Date(retiree.authority_for_retirement_dated)
              .toISOString()
              .split('T')[0]
          : '',
        retirement_date: retiree?.retirement_date
          ? new Date(retiree.retirement_date).toISOString().split('T')[0]
          : '',
        date_from_which_pension_will_commence:
          retiree?.date_from_which_pension_will_commence
            ? new Date(retiree.date_from_which_pension_will_commence)
                .toISOString()
                .split('T')[0]
            : '',
        last_basic_salary_amount: retiree?.last_basic_salary_amount ?? '',
        last_pay_date: retiree.last_pay_date
          ? new Date(retiree.last_pay_date).toISOString().split('T')[0]
          : '',
        disability_status: retiree?.disability_status ?? '',
        exit_grounds: retiree?.exitGround?.name ?? '',

        tax_exempt_certificate_number:
          retiree?.tax_exempt_certificate_number ?? '',
        tax_exempt_certificate_date: retiree?.tax_exempt_certificate_date
          ? new Date(retiree.tax_exempt_certificate_date)
              .toISOString()
              .split('T')[0]
          : '',

        military_id: retiree?.military_id ?? '',
        monthly_salary_in_ksh: retiree?.monthly_salary_in_ksh ?? 0,
        service_increments: retiree?.service_increments ?? 0,
        monthly_aditional_pay: retiree?.monthly_aditional_pay ?? 0,
        tribe: retiree?.tribe ?? '',
        maintenance_case: retiree?.maintenance_case ?? 1,
        is_wcps: retiree?.is_wcps ?? 1,
        is_parliamentary: retiree?.is_parliamentary ?? false,

        commutation_option_selection: retiree?.commutation_option_selection,
        commutation_option_selection_date:
          retiree?.commutation_option_selection_date
            ? new Date(retiree?.commutation_option_selection_date)
                .toISOString()
                .split('T')[0]
            : '',
        isCommutable: retiree?.exitGround?.has_commutation ?? false,
        was_injured: retiree?.was_injured ? 1 : 0,
        date_of_injury_for_cap189:
          parseDate(retiree?.injury_details_for_cap189?.date_of_injury) ?? '',

        salary_at_injury_for_cap189:
          retiree?.injury_details_for_cap189?.salary_at_injury ?? '',

        rate_of_injury_id_for_cap189:
          retiree?.injury_details_for_cap189?.rate_of_injury_id || '', // CAP 189 specific

        degree_of_disablement_for_cap199:
          retiree?.degree_of_disablement_details_for_cap199
            ?.degree_of_disablement || 0,

        date_of_injury_for_cap199:
          parseDate(
            retiree?.degree_of_disablement_details_for_cap199?.date_of_injury
          ) ?? '',

        salary_at_injury_for_cap199:
          retiree?.degree_of_disablement_details_for_cap199?.salary_at_injury ??
          '',
        was_in_mixed_service: retiree?.was_in_mixed_service ?? false,
      });
      console.log('retiree GP178 🟢🟢🟢 ********', retiree);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPostandNature = async () => {
    try {
      const res = await setupsApiService.get(
        endpoints.getPostAndNature(retireeId)
      );
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        console.log('Post and Nature Data:', sortedData);
        setPostAndNatureData(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  const fetchPeriodsOfAbsence = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPeriodsOfAbsence(retireeId)
      );
      setPeriodsOfAbsence(res.data.data);

      return res.data.data;
    } catch (error) {}
  };

  const fetchPensionableSalary = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPensionableSalary(retireeId)
      );

      const hasReviewPeriods = res.data.data.some((item) => item.review_period);

      //  setAddAditionalCols(hasReviewPeriods);

      setPensionableSalary(res.data.data);

      console.log('Pensionable Salary', res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      //setLoading(false);
    }
  };
  const getClaimPensionableService = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimPensionableService(clickedItem.id_claim)
      );
      setPensionableService(res.data.data);
    } catch (error) {
      console.log('Error getting claim pensionable service:', error);
    }
  };

  const getClaimQualifyingService = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getClaimQualyfyingService(clickedItem?.id_claim)
      );
      setQualifyingService(res.data.data);
    } catch (error) {
      console.log('Error getting claim qualifying service:', error);
    }
  };

  const contentRef = useRef();

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
    clonedElement.style.transform = 'scale(0.99)';
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
        })
        .catch(() => {
          setLoading(false);
        });
    }); // Adjust the delay as needed
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getClaimQualifyingService(),
          fetchPeriodsOfAbsence(),
          fetchPostandNature(),
          fetchPensionableSalary(),
          fetchRetiree(),
          getClaimPensionableService(),
        ]);
        generatePdfBlob();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">GP178 Report</h2>
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
      <div className="hidden">
        <div
          ref={contentRef}
          className="max-w-3xl ml-5 font-times mt-8 text-[13px]  bg-white "
        >
          <h1 className="text-center text-lg font-bold mb-6">
            REPUBLIC OF KENYA
          </h1>

          <div className=" w-full grid grid-cols-2 gap-[140px]">
            <div className="flex gap-1 mb-4">
              <p className="font-semibold">Ref. No.</p>
              <div className="border-b border-gray-800 flex-grow h-5"></div>{' '}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="border-b border-gray-800 flex-grow h-5"></div>{' '}
              <div className="border-b border-gray-800 flex-grow h-5"></div>{' '}
              <div className="border-b border-gray-800 flex-grow h-5"></div>{' '}
            </div>
          </div>

          <p className="text-start font-semibold mb-4">
            THE PERMANENT SECRETARY TO THE TREASURY, <br />
            P.O. BOX 30007, NAIROBI.
          </p>

          <h2 className="text-center font-semibold   mb-1">
            CLAIM FOR RETIREMENT PENSION, MARRIAGE OR DEATH GRATUITY
          </h2>

          <p className="text-sm text-center italic mb-4">
            (For use in respect of pensionable officers only)
          </p>

          <div className="mb-6">
            <p>
              The following particulars are furnished in support of a claim for:
            </p>
            <ul className="list-disc list-inside ml-4 mb-4">
              <li>Unreduced Retirement Pension</li>
              <li>Reduced Retirement Pension and Gratuity</li>
              <li>Service Gratuity</li>
              <li>Marriage Gratuity</li>
              <li>Death Gratuity</li>
            </ul>

            <p className="mb-2">
              for award under the provisions of the Pensions Act:
            </p>
            <ol className="list-lower-alpha-brackets list-inside ml-9 mb-4">
              <li>Delete items which are not applicable.</li>
              <li>
                This form should not be used for Compassionate Gratuity and/or
                Annual Allowance.
              </li>
            </ol>
          </div>

          <Divider
            sx={{
              backgroundColor: '#000',
              height: 2,
              marginBottom: '1rem',
            }}
          />

          <h3 className="text-sm text-center font-bold mb-2">
            PART I—STATEMENT OF PARTICULARS
          </h3>
          <form>
            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                1. Full name of officer in respect of whom pension/gratuity is
                claimed{' '}
                <p className="text-gray-500 uppercase absolute right-14">
                  {retiree.full_name}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                2. Personal number/Identification number{' '}
                <p className="text-gray-500 uppercase absolute right-[35%]">
                  {retiree.personal_number}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
              <div className="flex gap-1">
                <span className="italic">
                  (Where necessary for purpose of identification)
                </span>
              </div>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                3. Date of birth/age{' '}
                <p className="text-gray-500 uppercase absolute right-[45%]">
                  {retiree.dob}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
              <span className="italic">
                (Birth Certificate should be attached where necessary)
              </span>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                4. Designation and grade{' '}
                <p className="text-gray-500 uppercase absolute right-[38%]">
                  {retiree.designation_name}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                5. Ministry/Department{' '}
                <p className="text-gray-500 uppercase absolute right-[30%]">
                  {retiree.ministry_department_name}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                6. Date of first appointment{' '}
                <p className="text-gray-500 uppercase absolute right-[50%]">
                  {retiree.date_of_first_appointment}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                7. Date from which pension will commence/Date of death{' '}
                <p className="text-gray-500 uppercase absolute right-[30%]">
                  {retiree.date_from_which_pension_will_commence}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                8. Cause of retirement{' '}
                <p className="text-gray-500 uppercase absolute right-[30%]">
                  {retiree.exit_grounds}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                9. Authority for retirement{' '}
                <p className="text-gray-500 uppercase absolute right-[35%]">
                  {retiree.authority_for_retirement_reference}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="flex font-semibold gap-1">
                10. Date on which the officer was confirmed in pensionable
                office{' '}
                <p className="text-gray-500 uppercase absolute right-[30%]">
                  {retiree.date_of_confirmation}
                </p>
                <div className="border-b border-gray-800 flex-grow h-6"></div>
              </label>
            </div>

            <div className="mb-3 relative">
              <label className="block font-semibold">
                11. Full name and address of deceased officer’s legal personal
                representative{' '}
                <span className="italic">
                  (applicable to death gratuity only)
                </span>
              </label>
              <p className="text-gray-500 uppercase absolute right-[50%]">
                {retiree.full_name}
              </p>
              <div className="flex gap-1">
                <div className="border-b border-gray-800 flex-grow h-7"></div>
              </div>
            </div>
          </form>

          {/* PART II  POST AND NATURE */}

          <div className="container mx-auto text-[13px] p-4 mt-[30px]">
            <h2 className=" font-semibold mb-3">
              12. Details of posts held, the nature of the salary scale of each
              post and the nature of the terms of service of the officer:
            </h2>
            <table className="min-w-full border border-black">
              <thead>
                <tr>
                  <th className="border border-black px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-black px-4 py-2 text-left">
                    Post
                  </th>
                  <th className="border border-black px-4 py-2 text-left">
                    Whether Pensionable (Yes/No)
                  </th>
                  <th className="border border-black px-4 py-2 text-left">
                    Nature of Salary Scale*
                  </th>
                  <th className="border border-black px-4 py-2 text-left">
                    Nature of Service†
                  </th>
                </tr>
              </thead>
              <tbody>
                {postAndNatureData.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-black px-4 py-2">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.post}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.was_pensionable ? 'Yes' : 'No'}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.nature_of_salary_scale}
                    </td>
                    <td className="border border-black px-4 py-2">
                      {item.nature_of_service}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PART III  DECLARATION */}

          <div className="container mx-auto p-4">
            <form className="space-y-6">
              <div>
                <h2 className=" font-semibold mb-4">
                  13. Particulars of war service, if any:
                </h2>
                <table className="min-w-full border border-black">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2">
                        Date of Leaving Civil Employment
                      </th>
                      <th className="border border-black px-4 py-2">
                        Date of Joining H.M. Forces
                      </th>
                      <th className="border border-black px-4 py-2">
                        Date of Leaving H.M. Forces
                      </th>
                      <th className="border border-black px-4 py-2">
                        Date of Resuming Civil Employment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="py-4">
                      <td className="border border-black px-4 py-6"></td>
                      <td className="border border-black px-4 py-6"></td>
                      <td className="border border-black px-4 py-6"></td>
                      <td className="border border-black px-4 py-6"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* PART IV  PERIODS OF ABSENCE WITHOUT SALARY */}

              <div>
                <h2 className=" font-semibold mb-4">
                  14. Periods of absence without salary:
                </h2>
                <table className="min-w-full border border-black">
                  <thead>
                    <tr>
                      <th className=" px-4 pt-10">Year</th>
                      <th className="border border-black px-4 " colSpan="2">
                        Period of Absence
                      </th>
                      <th className="border-r border-black px-4 pt-10">
                        Number of Days
                      </th>
                      <th className="px-4 pt-10">Cause of Absence</th>
                    </tr>
                    <tr>
                      <th></th>
                      <th className="border border-black px-4 py-1">
                        Start Date
                      </th>
                      <th className="border border-black px-4 py-1">To Date</th>
                      <th className="border-r border-black"></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodsOfAbsence.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-black px-4 py-2">
                          {new Date(item.start_date).getFullYear()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {new Date(item.start_date).toLocaleDateString()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {new Date(item.end_date).toLocaleDateString()}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {item.number_of_days}
                        </td>
                        <td className="border border-black px-4 py-2">
                          {item.cause_of_absence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PART V  BREAK IN SERVICE */}

              <div>
                <h2 className=" font-semibold mb-4">
                  15. Break in service, if any: From _________________________
                  to ____________________________
                </h2>
              </div>

              <div>
                <h2 className=" font-semibold mb-2">
                  16. If the break is condoned, quote authority:
                </h2>
                <p className=" font-semibold">
                  ____________________________________________dated_____________________________________
                </p>
              </div>

              <div>
                <h2 className=" font-semibold mb-4">
                  17. (1) Date on which officer proceeded on terminal vacation
                  leave:______________________________
                </h2>

                <h2 className=" font-semibold mb-4 ml-2">
                  (2) Date of cessation of salary (i.e., last day of
                  pay):________________________________________
                </h2>
              </div>

              <div className="relative mt-4">
                <h2 className=" font-semibold mb-8">
                  18. Rates of salary and pensionable allowance, if any, payable
                  during last three years of service to date of cessation of
                  salary:
                </h2>

                {pensionableSalary &&
                  pensionableSalary.length > 0 &&
                  pensionableSalary.some((item) => item.review_period) &&
                  pensionableSalary
                    .filter((item) => item.review_period)
                    .map((row, index) => (
                      <div
                        className="flex flex-col  justify-center items-center absolute right-0 top-6 font-bold"
                        key={index}
                      >
                        <p className="font-medium">
                          {parseDate(row.review_period)}
                        </p>{' '}
                        <p className="">Salary Equivalent</p>{' '}
                      </div>
                    ))}

                {pensionableSalary && pensionableSalary.length > 0
                  ? pensionableSalary.some((item) => item.review_period)
                    ? pensionableSalary.map((row, index) => (
                        <div className="flex gap-1" key={index}>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="col-span-1 mb-2">
                              <label className="block relative">
                                From: ________________ to:_________________
                                <p className="absolute top-0 left-[15%] font-bold">
                                  {parseDate(row.start_date)}
                                </p>
                                <p className="absolute top-0 right-[15%] font-bold">
                                  {parseDate(row.end_date)}
                                </p>
                              </label>
                            </div>
                            <div className="col-span-1 flex flex-col relative">
                              <p className="">
                                Salary @ £ ___________________________ p.a.
                              </p>
                              <p className="absolute top-0 right-[45%] font-bold">
                                {formatNumber(row.salary)}
                              </p>
                              <p className="mt-2">
                                Pensionable Allowance @ £ _____________ p.a.
                              </p>
                              <p className="absolute top-7 right-[25%] font-bold">
                                {formatNumber(row.pensionable_allowance)}
                              </p>
                            </div>
                          </div>

                          <div className="px-2 w-[100px]">
                            {row.salaryReviews &&
                            row.salaryReviews.length > 0 ? (
                              <div className="">
                                <p className="text-center font-bold">
                                  {formatNumber(
                                    row.salaryReviews[0].new_salary
                                  )}
                                </p>
                              </div>
                            ) : (
                              <p className="text-center">-</p>
                            )}
                          </div>
                        </div>
                      ))
                    : pensionableSalary.map((row, index) => (
                        <div className="flex " key={index}>
                          <div className="grid grid-cols-2 gap-1 mb-2">
                            <div className="col-span-1 mb-4">
                              <label className="block relative">
                                From: ___________________
                                to:_____________________
                                <p className="absolute top-0 left-[15%] font-bold">
                                  {parseDate(row.start_date)}
                                </p>
                                <p className="absolute top-0 right-[15%] font-bold">
                                  {parseDate(row.end_date)}
                                </p>
                              </label>
                            </div>
                            <div className="col-span-1 flex flex-col relative">
                              <p className="">
                                Salary @ £ ____________________________________
                                p.a.
                              </p>
                              <p className="absolute top-0 right-[45%] font-bold">
                                {formatNumber(row.salary)}
                              </p>
                              <p className="mt-2">
                                Pensionable Allowance @ £ ______________________
                                p.a.
                              </p>
                              <p className="absolute top-8 right-[35%] font-bold">
                                {formatNumber(row.pensionable_allowance)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  : [...Array(6)].map((_, index) => (
                      <div key={index} className="grid grid-cols-2 gap-1 mb-2">
                        <div className="col-span-1 mb-4">
                          <label className="block">
                            From: ___________________ to:_____________________
                          </label>
                        </div>
                        <div className="col-span-1 flex flex-col">
                          <p>
                            Salary @ £ ____________________________________ p.a.
                          </p>
                          <p className="mt-2">
                            Pensionable Allowance @ £ ______________________
                            p.a.
                          </p>
                        </div>
                      </div>
                    ))}
              </div>

              <div>
                <h2 className=" font-semibold mb-4">
                  19. The officer contributed to provident fund
                  from__________________________ to ___________________________
                  and surrendered personal contributions for period from
                  ______________________ to ___________________________
                </h2>
              </div>

              <Divider
                sx={{
                  backgroundColor: '#000',
                  height: 3,
                  marginBottom: '1rem',
                }}
              />
              <div className="p-6 bg-white  text-black">
                {/* Section for Part II - Accounting Officer's Certificate */}
                <h3 className="font-bold underline text-center mb-4">
                  PART II - ACCOUNTING OFFICERS CERTIFICATE
                </h3>

                <div className="space-y-3">
                  {/* Point 1 */}
                  <div className="flex">
                    <p className="flex-grow">
                      1. Marriage/Death Certificate is enclosed/being obtained
                      for verification by you.
                    </p>
                  </div>

                  {/* Point 2 */}
                  <div className="flex">
                    <p className="flex-grow">
                      2. The officer’s attention has been drawn to the
                      requirements of the pension regulation concerning
                      commutation of a portion of his pension.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="flex">
                    <p className="flex-grow">
                      3. The officer was a contributor to the W.C.P.S. Forms
                      G.P. 209, 210, 211, 212, 213, 214, and 215 to be attached
                      as applicable.
                    </p>
                  </div>

                  {/* Point 4 */}
                  <div className="flex">
                    <p className="flex-grow">
                      4. I certify that the officer has/has no Government
                      Liability including a car loan/bicycle advance. Detailed
                      breakdown attached.
                    </p>
                  </div>

                  {/* Point 5 */}
                  <div className="flex">
                    <p className="flex-grow">
                      5. The officer served only in aided schools and his/her
                      admission to the Free Pension Scheme was, therefore, not
                      subject to the payment of pension contributions.
                      (Applicable only to non-civil servant teachers serving
                      with the Teachers Service Commission).
                    </p>
                  </div>

                  {/* Point 6 */}
                  <div className="flex">
                    <p className="flex-grow">
                      6. I certify that the particulars furnished on this form
                      are correct. I further certify that the officer was/was
                      not eligible for a Contract Gratuity in respect of the
                      period of contract service shown in Part I and that no
                      such Gratuity has been paid in respect of that period.
                    </p>
                  </div>
                </div>

                {/* Signature and Date */}
                <div className="mt-4">
                  <label className="block">
                    Date: ________________________
                  </label>
                  <div className="flex justify-end mt-2">
                    <div className="text-right">
                      <p>___________________________________________</p>
                      <p>Accounting Officer,</p>
                      <p>Ministry/Department of ________________________</p>
                    </div>
                  </div>
                </div>

                <Divider
                  sx={{
                    backgroundColor: '#000',
                    height: 3,
                    mt: 5,
                    marginBottom: '1rem',
                  }}
                />
                {/* Section for Part III - Computation of Pension/Gratuity */}
                <h3 className="font-bold underline text-center mt-8 mb-4">
                  PART III - COMPUTATION OF PENSION/GRATUITY
                </h3>

                {/* Table for Computation */}
                <div className="mb-12 border-black">
                  <div className="grid grid-cols-6 border-black mb-6">
                    <p className="col-span-2"></p>
                    <p className="col-span-1 font-semibold italic text-sm">
                      Years
                    </p>
                    <p className="col-span-1 font-semibold italic text-sm">
                      Months
                    </p>
                    <p className="col-span-1 font-semibold italic text-sm">
                      Days
                    </p>
                    <p className="col-span-1 font-semibold italic text-sm">
                      Completed Months
                    </p>
                  </div>

                  {/* Rows for Qualifying Service */}
                  <div className="grid grid-cols-6 p-2 mb-4">
                    <p className="col-span-2 font-semibold">
                      QUALIFYING SERVICE:
                    </p>
                    {qualifyingService.map((service, index) => (
                      <React.Fragment key={index}>
                        <p className="col-span-1">
                          {service.qualifying_service_years}
                        </p>
                        <p className="col-span-1">
                          {service.qualifying_service_months}
                        </p>
                        <p className="col-span-1">
                          {service.qualifying_service_days}
                        </p>
                        <p className="col-span-1 text-center">
                          {service.qualifying_service_cumulative_months}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Rows for Pensionable Service */}
                  <div className="grid grid-cols-6 p-2">
                    <p className="col-span-2 font-semibold">
                      PENSIONABLE SERVICE:
                    </p>
                    {pensionableService.map((service, index) => (
                      <React.Fragment key={index}>
                        <p className="col-span-1">
                          {service.pensionable_service_years}
                        </p>
                        <p className="col-span-1">
                          {service.pensionable_service_months}
                        </p>
                        <p className="col-span-1">
                          {service.pensionable_service_days}
                        </p>
                        <p className="col-span-1 text-center">
                          {service.pensionable_service_cumulative_months}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {/* Section for Part IV - Pension/Gratuity Payable */}

                <div className="">
                  <p className="text-justify mb-6">
                    I certify that the Pension/Gratuity which may be paid to the
                    officer/legal personal representative in accordance with the
                    Pensions Act, as amended and the Pensions Regulations now in
                    force amounts to K£ _________________________ per year
                    commencing from _________________________ .
                  </p>
                  <p className="text-justify mb-6">
                    *As he exercised the option for Reduced Pension and
                    Gratuity, the reduced pension amounts to K£
                    _________________________ per year with a gratuity of K£
                    _________________________ .
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <p>Date: _________________________________ </p>
                    <div className="flex flex-col">
                      <p>_____________________________</p>
                      <p className="italic text-center">
                        Chief Pensions Officer
                      </p>
                    </div>
                  </div>
                  <Divider
                    sx={{
                      backgroundColor: '#000',
                      height: 2,
                      marginBottom: '1rem',
                    }}
                  />
                  <div className="mb-6">
                    <p className="uppercase font-bold">
                      The Controller and Auditor-General, Nairobi.
                    </p>
                    <p>Forwarded for favour of verification and return.</p>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <p>Date: _________________________________ </p>
                    <div className="flex flex-col">
                      <p>_______________________________</p>
                      <p className="italic text-center">
                        {' '}
                        Chief Pensions Officer
                      </p>
                    </div>
                  </div>

                  <Divider
                    sx={{
                      backgroundColor: '#000',
                      height: 2,
                      marginBottom: '1rem',
                    }}
                  />
                  <div className="mb-6">
                    <p className="uppercase font-bold">
                      The Principal Pensions Officer, Pensions Division,
                      Treasury, Nairobi.
                    </p>
                    <p>Computation agreed.</p>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <p>Date: _________________________________ </p>
                    <div className="flex flex-col">
                      <p>_______________________________</p>
                      <p className="italic text-center">
                        {' '}
                        Controller and Auditor-General
                      </p>
                    </div>
                  </div>

                  <Divider
                    sx={{
                      backgroundColor: '#000',
                      height: 2,
                      marginBottom: '1rem',
                    }}
                  />
                  <div className="mb-6">
                    <p className="uppercase font-bold text-center">
                      Award Approved
                    </p>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <p>Date: _________________________________ </p>
                    <div className="flex flex-col">
                      <p>_______________________________</p>
                      <p className="italic text-center">
                        {' '}
                        Principal Pensions Officer, Treasury
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Copy to:</p>
                    <div className="list-disc ml-8">
                      <p>
                        The Accounting Officer
                        ______________________________________________________________
                      </p>
                      <p>
                        Mr./Miss/Mrs.
                        ______________________________________________________________________
                      </p>
                    </div>
                  </div>
                  <Divider
                    sx={{
                      backgroundColor: '#000',
                      height: 2,
                      marginTop: '1rem',
                    }}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GP178Report;
