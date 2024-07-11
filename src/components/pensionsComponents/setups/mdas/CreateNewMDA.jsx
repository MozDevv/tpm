"use client";
import React, { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

function CreateNewMDA({ fetchMDAs, setOpenNewMDA }) {
  const [pensionCaps, setPensionCaps] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pensionCap, setPensionCap] = useState("");
  const [employerType, setEmployerType] = useState("");
  const [shortName, setShortName] = useState("");

  const { setAlert } = useAlert();

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps);

      if (res.status === 200 && res.data.succeeded === true) {
        setPensionCaps(res.data.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []);

  const handleCreateMda = async (e) => {
    e.preventDefault();

    const data = {
      code,
      name,
      description,
      pension_cap_id: pensionCap,
      employer_type: Number(employerType),
      short_name: shortName,
    };

    try {
      const res = await apiService.post(endpoints.createMDA, data);

      if (res.status === 200 && res.data.succeeded === true) {
        await fetchMDAs();
        setCode("");
        setName("");
        setDescription("");
        setPensionCap("");

        setEmployerType("");
        setShortName("");
        setOpenNewMDA(false);
        setAlert({
          open: true,
          message: "MDA created successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="p-8">
      <div className="text-primary pl-1 text-lg font-semibold">New MDA</div>
      <form onSubmit={handleCreateMda} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            Employer Code
          </label>
          <input
            type="text"
            onChange={(e) => setCode(e.target.value)}
            value={code}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            {" "}
            Employer Name
          </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            Employer Type
          </label>
          <select
            name="employer_type"
            onChange={(e) => setEmployerType(e.target.value)}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            required
          >
            <option value="">-------</option>
            <option value={0}>Ministry</option>
            <option value={1}>Department</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            rows={4}
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            Short Name
          </label>
          <input
            type="text"
            onChange={(e) => setShortName(e.target.value)}
            value={shortName}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-gray-600">
            Pension Cap
          </label>
          <select
            name="role"
            onChange={(e) => setPensionCap(e.target.value)}
            className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
            required
          >
            <option value="">-------</option>
            {pensionCaps.map((pensionCap) => (
              <option key={pensionCap.id} value={pensionCap.id}>
                {pensionCap.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex items-center mt-8">
          <Button type="submit" variant="contained" fullWidth>
            Save MDA
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewMDA;
