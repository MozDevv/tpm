import { useAlert } from "@/context/AlertContext";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import endpoints from "@/components/services/setupsApi";
import EditableTable from "@/components/baseComponents/EditableTable";

function PostAndNature({ id, loading, setLoading, status }) {
  const [postAndNatureData, setPostAndNatureData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    post: "",
    was_pensionable: false,
    nature_of_salary_scale: "",
    nature_of_service: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();
  const [dateOfConfirmation, setDateOfConfirmation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPostandNature = async () => {
    try {
      const res = await apiService.get(endpoints.getPostAndNature(id));
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPostAndNatureData(sortedData);
      }
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostandNature();
    }
  }, [id]);

  const [dateOfFirstAppointment, setDateOfFirstAppointment] = useState("");

  const [mdaId, setMdaId] = useState("");
  const [cap, setCap] = useState("");

  const [pensionAward, setPensionAward] = useState(null);

  //const [pensio]

  const fetchProspectivePensioners = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      setDateOfConfirmation(
        new Date(res.data.data[0].date_of_confirmation)
          .toISOString()
          .split("T")[0]
      );

      setDateOfFirstAppointment(
        new Date(res.data.data[0].date_of_first_appointment)
          .toISOString()
          .split("T")[0]
      );

      setCap(res.data.data[0].mda.pensionCap.name);
      //setCap("CAP196");
      setMdaId(res.data.data[0].mda.id);
      console.log(
        "first appointment",
        res.data.data[0].date_of_first_appointment
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProspectivePensioners();
  }, []);

  const [designations, setDesignations] = useState([]);

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        "paging.pageSize": 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error("Error fetching Designations:", error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);
  const natureOfServiceOptions = {
    CAP189: [
      { id: "Probation", name: "Probation" },
      { id: "Permanent", name: "Permanent" },
      { id: "Temporary", name: "Temporary" },
      { id: "Contract", name: "Contract" },
    ],
    CAP199: [
      { id: "ReckonableService", name: "Reckonable Service" },
      { id: "NonReckonableService", name: "Non-Reckonable Service" },
    ],
    CAP196: [
      { id: "ParliamentaryTerms", name: "Parliamentary Terms" },
      { id: "OneTerm", name: "1 Term" },
      { id: "TwoTerms", name: "2 Term" },
      { id: "ThreeTerms", name: "3 Term" },
      { id: "FourTerms", name: "4 Term" },
      { id: "FiveTerms", name: "5 Term" },
    ],
    "APN/PK": [
      { id: "OneTerm", name: "1 Term" },
      { id: "TwoTerms", name: "2 Term" },
      { id: "ThreeTerms", name: "3 Term" },
      { id: "FourTerms", name: "4 Term" },
      { id: "FiveTerms", name: "5 Term" },
    ],
  };

  const fields = [
    //{label: "Date Of First Appointment", value: "date_of_first_appointment", type: "date"},
    { label: "Start Date", value: "date", type: "date" },
    {
      label: "Post",
      value: "post",
      type: "select",
      options: designations
        .filter((designation) => designation?.mda?.id === mdaId)
        .map((designation) => ({
          id: designation.name,
          name: designation.name,
        })),
    },
    {
      label: "Whether Pensionable(Yes/No)",
      value: "was_pensionable",
      type: "radio",
    },
    {
      label: "Nature of Salary Scale",
      value: "nature_of_salary_scale",
      type: "select",
      options: [
        { id: "P", name: "Pensionable" },
        { id: "Pro", name: "Probation" },
        { id: "T", name: "Temporary" },
        { id: "C", name: "Contract" },
      ],
    },
    {
      label: "Nature of Service",
      value: "nature_of_service",
      type: "select",
      options: natureOfServiceOptions[cap] || [],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === "radio" ? JSON.parse(value) : value,
    };

    // Automatically set related fields based on 'whether pensionable'
    if (name === "was_pensionable") {
      updatedFormData.nature_of_salary_scale = value === true ? "P" : "";
      updatedFormData.nature_of_service = value === true ? "Permanent" : "";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (data) => {
    const formattedFormData = { ...data, prospective_pensioner_id: id };
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      let res;
      if (isEditMode) {
        const data = { ...formattedFormData, id: editId };
        res = await apiService.post(
          endpoints.updateMixedServiceWorkHistory,
          data
        );
      } else {
        res = await apiService.post(
          endpoints.createMixedServiceWorkHistory,
          formattedFormData
        );
      }

      if (res.status === 200 && res.data.succeeded) {
        fetchPostandNature();
        setAlert({
          open: true,
          message: `Post and Nature of Service ${
            isEditMode ? "updated" : "added"
          } successfully`,
          severity: "success",
        });
        setOpen(false);
      }
      if (res.data.validationErrors) {
        const errors = {};
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
        setValidationErrors(errors);
        throw new Error("Validation Error");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleEdit = (item) => {
    const formattedItem = {
      ...item,
      date: dayjs(item.date).format("YYYY-MM-DD"),
      // end_date: dayjs(item.end_date).format("YYYY-MM-DD"),
    };

    setFormData(formattedItem);
    setEditId(item.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(preClaimsEndpoints.deletePostAndNature(recordId));
      fetchPostandNature();
      setAlert({
        open: true,
        message: "Post and Nature deleted successfully",
        severity: "success",
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();
  const validators = {
    date: (value) => {
      if (!value) {
        return "Date is required";
      }
    },
    post: (value) => {
      if (!value) {
        return "Post is required";
      }
    },
    was_pensionable: (value) => {
      if (value === null) {
        return "Pensionable is required";
      }
    },
    nature_of_salary_scale: (value) => {
      if (!value) {
        return "Nature of Salary Scale is required";
      }
    },
    nature_of_service: (value) => {
      if (!value) {
        return "Nature of Service is required";
      }
    },
  };

  const handleError = (errors) => {
    console.log("Errors:", errors);
  };

  return (
    <div className="">
      <EditableTable
        title="Post and Nature of Salary"
        fetchData={fetchPostandNature}
        fields={fields}
        //  initialData={initialData}
        validators={validators}
        handleSave={handleSubmit}
        handleUpdate={handleSubmit}
        handleError={handleError}
        validationErrorsFromApi={validationErrors}
      />
    </div>
  );
}

export default PostAndNature;
