import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';

import endpoints, {
  apiService as setupsApiService,
} from '@/components/services/setupsApi';
import { parseDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import { Divider } from '@mui/material';
import React, { useEffect } from 'react';

const GP178Report = ({ retireeId }) => {
  const [retiree, setRetiree] = React.useState({});
  const [postAndNatureData, setPostAndNatureData] = React.useState([]);
  const [periodsOfAbsence, setPeriodsOfAbsence] = React.useState([]);
  const [pensionableSalary, setPensionableSalary] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [hasReviewPeriods, setHasReviewPeriods] = React.useState(false);
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

  useEffect(() => {
    fetchRetiree();
  }, []);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodsOfAbsence();
  }, []);

  useEffect(() => {
    fetchPostandNature();
    fetchPensionableSalary();
  }, []);
  return (
    <div className="max-w-4xl mx-auto font-times mt-8 p-6 bg-white shadow-md rounded-lg border border-gray-300">
      <h1 className="text-center text-xl font-bold mb-6">REPUBLIC OF KENYA</h1>

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

      <h2 className="text-center font-semibold text-lg  mb-1">
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

      <h3 className="text-lg text-center font-bold mb-4">
        PART I—STATEMENT OF PARTICULARS
      </h3>
      <form>
        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            1. Full name of officer in respect of whom pension/gratuity is
            claimed{' '}
            <p className="text-gray-500 uppercase absolute right-14">
              {retiree.full_name}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
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

        <div className="mb-4 relative">
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

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            4. Designation and grade{' '}
            <p className="text-gray-500 uppercase absolute right-[38%]">
              {retiree.designation_name}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            5. Ministry/Department{' '}
            <p className="text-gray-500 uppercase absolute right-[30%]">
              {retiree.ministry_department_name}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            6. Date of first appointment{' '}
            <p className="text-gray-500 uppercase absolute right-[50%]">
              {retiree.date_of_first_appointment}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            7. Date from which pension will commence/Date of death{' '}
            <p className="text-gray-500 uppercase absolute right-[30%]">
              {retiree.date_from_which_pension_will_commence}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            8. Cause of retirement{' '}
            <p className="text-gray-500 uppercase absolute right-[30%]">
              {retiree.exit_grounds}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            9. Authority for retirement{' '}
            <p className="text-gray-500 uppercase absolute right-[35%]">
              {retiree.authority_for_retirement_reference}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="flex font-semibold gap-1">
            10. Date on which the officer was confirmed in pensionable office{' '}
            <p className="text-gray-500 uppercase absolute right-[30%]">
              {retiree.date_of_confirmation}
            </p>
            <div className="border-b border-gray-800 flex-grow h-6"></div>
          </label>
        </div>

        <div className="mb-4 relative">
          <label className="block font-semibold">
            11. Full name and address of deceased officer’s legal personal
            representative{' '}
            <span className="italic">(applicable to death gratuity only)</span>
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

      <div className="container mx-auto p-4 mt-[120px]">
        <h2 className="text-lg font-semibold mb-4">
          12. Details of posts held, the nature of the salary scale of each post
          and the nature of the terms of service of the officer:
        </h2>
        <table className="min-w-full border border-black">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2 text-left">Date</th>
              <th className="border border-black px-4 py-2 text-left">Post</th>
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
                <td className="border border-black px-4 py-2">{item.post}</td>
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
            <h2 className="text-lg font-semibold mb-4">
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
            <h2 className="text-base font-semibold mb-4">
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
                  <th className="border border-black px-4 py-1">Start Date</th>
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
            <h2 className="text-base font-semibold mb-4">
              15. Break in service, if any: From _________________________ to
              ____________________________
            </h2>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-2">
              16. If the break is condoned, quote authority:
            </h2>
            <p className="text-base font-semibold">
              ____________________________________________dated_____________________________________
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4">
              17. (1) Date on which officer proceeded on terminal vacation
              leave:______________________________
            </h2>

            <h2 className="text-base font-semibold mb-4 ml-2">
              (2) Date of cessation of salary (i.e., last day of
              pay):________________________________________
            </h2>
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4">
              18. Rates of salary and pensionable allowance, if any, payable
              during last three years of service to date of cessation of salary:
            </h2>

            {pensionableSalary && pensionableSalary.length > 0
              ? pensionableSalary.map((row, index) => (
                  <div className="flex " key={index}>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="col-span-1 mb-4">
                        <label className="block relative">
                          From: ___________________ to:_____________________
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
                          Salary @ £ ____________________________________ p.a.
                        </p>
                        <p className="absolute top-0 right-[45%] font-bold">
                          {formatNumber(row.salary)}
                        </p>
                        <p className="mt-2">
                          Pensionable Allowance @ £ ______________________ p.a.
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
                        Pensionable Allowance @ £ ______________________ p.a.
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GP178Report;
