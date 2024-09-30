"use client";
import React, { use, useEffect } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { parseDate } from "@/utils/dateFormatter";
import { name } from "dayjs/locale/en-au";
import BaseCollapse from "@/components/baseComponents/BaseCollapse";

const GeneralSettings = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,

      id: item.id,
      prospective_pensioner_notification_schedule_max_records:
        item.prospective_pensioner_notification_schedule_max_records,
      date_of_confirmation_lower_limit: parseDate(
        item.date_of_confirmation_lower_limit
      ),
      date_of_appointment_lower_limit: parseDate(
        item.date_of_appointment_lower_limit
      ),
      date_of_retirement_lower_limit: parseDate(
        item.date_of_retirement_lower_limit
      ),
      kenyan_pounds_to_ksh_factor: item.kenyan_pounds_to_ksh_factor,
      age_at_retirement_cap189: item.age_at_retirement_cap189,
      disabiled_age_at_retirement_cap189:
        item.disabiled_age_at_retirement_cap189,
      age_at_early_retirement_cap189: item.age_at_early_retirement_cap189,
      disabled_age_at_retirement_cap189: item.disabled_age_at_retirement_cap189,
      compassionate_gratuity_lower_period_years_cap189:
        item.compassionate_gratuity_lower_period_years_cap189,
      abolition_of_office_age_60_effect_date_cap189: parseDate(
        item.abolition_of_office_age_60_effect_date_cap189
      ),
      abolition_of_office_additional_pay_max_years_cap189:
        item.abolition_of_office_additional_pay_max_years_cap189,
      abolition_of_office_additional_pay_factor_cap189:
        item.abolition_of_office_additional_pay_factor_cap189,
      npc_12_20_lower_limit_cap189: item.npc_12_20_lower_limit_cap189,
      npc_12_20_upper_limit_cap189: item.npc_12_20_upper_limit_cap189,
      min_pensionable_period_in_years_cap189:
        item.min_pensionable_period_in_years_cap189,
      min_officers_reconnable_service_period_in_years_cap199:
        item.min_officers_reconnable_service_period_in_years_cap199,
      min_servicemen_reconnable_service_period_in_years_cap199:
        item.min_servicemen_reconnable_service_period_in_years_cap199,
      compassionate_gratuity_minimum_period_years_cap189:
        item.compassionate_gratuity_minimum_period_years_cap189,
      compassionate_gratuity_male_end_date_cap189:
        item.compassionate_gratuity_male_end_date_cap189,
      compassionate_gratuity_female_end_date_cap189: parseDate(
        item.compassionate_gratuity_female_end_date_cap189
      ),
      pension_portal_url: item.pension_portal_url,
      injury_pension_min_years_cap189: item.injury_pension_min_years_cap189,
      parliamentary_term_span_years: item.parliamentary_term_span_years,

      // roles: item.roles,
    }));
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log("Edit clicked"),
    delete: () => console.log("Delete clicked"),
    reports: () => console.log("Reports clicked"),
    notify: () => console.log("Notify clicked"),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? "Department" : "Create New Department";

  const fields = [
    {
      name: "prospective_pensioner_notification_schedule_max_records",
      label: "Prospective Pensioner Notification Schedule Max Records",
      type: "text",
      required: true,
    },
    {
      name: "date_of_confirmation_lower_limit",
      label: "Date Of Confirmation Lower Limit",
      type: "text",
      required: true,
    },
    {
      name: "date_of_appointment_lower_limit",
      label: "Date Of Appointment Lower Limit",
      type: "text",
      required: true,
    },
    {
      name: "date_of_retirement_lower_limit",
      label: "Date Of Retirement Lower Limit",
      type: "text",
      required: true,
    },
    {
      name: "kenyan_pounds_to_ksh_factor",
      label: "Kenyan Pounds To Ksh Factor",
      type: "text",
      required: true,
    },
    {
      name: "age_at_retirement_cap189",
      label: "Age At Retirement Cap189",
      type: "text",
      required: true,
    },
    {
      name: "disabiled_age_at_retirement_cap189",
      label: "Disabiled Age At Retirement Cap189",
      type: "text",
      required: true,
    },
    {
      name: "age_at_early_retirement_cap189",
      label: "Age At Early Retirement Cap189",
      type: "text",
      required: true,
    },
    {
      name: "disabled_age_at_retirement_cap189",
      label: "Disabled Age At Retirement Cap189",
      type: "text",
      required: true,
    },
    {
      name: "compassionate_gratuity_lower_period_years_cap189",
      label: "Compassionate Gratuity Lower Period Years Cap189",
      type: "text",
      required: true,
    },
    {
      name: "abolition_of_office_age_60_effect_date_cap189",
      label: "Abolition Of Office Age 60 Effect Date Cap189",
      type: "text",
      required: true,
    },
    {
      name: "abolition_of_office_additional_pay_max_years_cap189",
      label: "Abolition Of Office Additional Pay Max Years Cap189",
      type: "text",
      required: true,
    },
    {
      name: "abolition_of_office_additional_pay_factor_cap189",
      label: "Abolition Of Office Additional Pay Factor Cap189",
      type: "text",
      required: true,
    },
    {
      name: "npc_12_20_lower_limit_cap189",
      label: "Npc 12 20 Lower Limit Cap189",
      type: "text",
      required: true,
    },
    {
      name: "npc_12_20_upper_limit_cap189",
      label: "Npc 12 20 Upper Limit Cap189",
      type: "text",
      required: true,
    },
    {
      name: "min_pensionable_period_in_years_cap189",
      label: "Min Pensionable Period In Years Cap189",
      type: "text",
      required: true,
    },
    {
      name: "min_officers_reconnable_service_period_in_years_cap199",
      label: "Min Officers Reconnable Service Period In Years Cap199",
      type: "text",
      required: true,
    },
    {
      name: "min_servicemen_reconnable_service_period_in_years_cap199",
      label: "Min Servicemen Reconnable Service Period In Years Cap199",
      type: "text",
      required: true,
    },
    {
      name: "compassionate_gratuity_minimum_period_years_cap189",
      label: "Compassionate Gratuity Minimum Period Years Cap189",
      type: "text",
      required: true,
    },

    {
      name: "compassionate_gratuity_female_end_date_cap189",
      label: "Compassionate Gratuity Female End Date Cap189",
      type: "text",
      required: true,
    },
    {
      name: "pension_portal_url",
      label: "Pension Portal Url",
      type: "text",
      required: true,
    },
    {
      name: "injury_pension_min_years_cap189",
      label: "Injury Pension Min Years Cap189",
      type: "text",
      required: true,
    },
    {
      name: "parliamentary_term_span_years",
      label: "Parliamentary Term Span Years",
      type: "text",
      required: true,
    },
  ];

  const fetchGeneralSettings = async () => {
    try {
      const response = await apiService.get(endpoints.getGeneralSettings);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGeneralSettings().then((data) => {
      const data2 = transformData(data);
      setClickedItem(data2[0]);
    });
  }, []);
  const [openSections, setOpenSections] = React.useState({
    beneficiaries: false,
    otherSection: false,
  });

  const handleToggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white mt-8 px-5">
      {/* <BaseCollapse
        name="General Settings"
        openSections={openSections}
        handleToggleSection={handleToggleSection}
      > */}
      <BaseInputCard
        fields={fields}
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        useRequestBody={true}
        setOpenBaseCard={setOpenBaseCard}
      />
      {/* </BaseCollapse> */}
    </div>
  );
};

export default GeneralSettings;
