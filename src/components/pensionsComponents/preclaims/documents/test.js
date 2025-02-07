import React from 'react'

function test() {
  return (
    <div>
        // "prospectivePensionerAwards": [
//   {
//     "prospective_pensioner_id": "fc3beb7c-f22b-4f48-b91d-d19428fd978c",
//     "pension_award_id": "c85ffa52-1519-464b-9fad-a2b3362cfb2b",
//     "pension_award": {
//       "id": "c85ffa52-1519-464b-9fad-a2b3362cfb2b",
//       "pension_cap_id": "3be49117-74d7-428b-b4b3-25a836109927",
//       "prefix": "APN/PC",
//       "code": 33,
//       "has_commutation": false,
//       "name": "RETIREMENT ON AGE GROUNDS GRATUITY",
//       "description": "Retirement On Age Grounds Gratuity",
//       "start_date": null,
//       "end_date": null
//     },
//     "is_active": true,
//     "id": "0b8f798a-d75f-4469-b211-38892d646b53",
//     "created_by": "1677f2b9-99d3-41f8-ad74-dba8c777180f",
//     "created_date": "2025-02-03T04:41:38.862817Z",
//     "updated_by": null,
//     "updated_date": null
//   },
//   {
//     "prospective_pensioner_id": "fc3beb7c-f22b-4f48-b91d-d19428fd978c",
//     "pension_award_id": "f8cff874-b5fa-4e41-80bc-f9edb6dbbefa",
//     "pension_award": {
//       "id": "f8cff874-b5fa-4e41-80bc-f9edb6dbbefa",
//       "pension_cap_id": "3be49117-74d7-428b-b4b3-25a836109927",
//       "prefix": "APN/PC",
//       "code": 0,
//       "has_commutation": true,
//       "name": "RETIREMENT ON AGE GROUNDS PENSION",
//       "description": "Retirement On Age Grounds Pension",
//       "start_date": null,
//       "end_date": null
//     },
//     "is_active": true,
//     "id": "5eec9557-4504-4a9d-a25d-404925362f99",
//     "created_by": "1677f2b9-99d3-41f8-ad74-dba8c777180f",
//     "created_date": "2025-02-03T04:41:38.862813Z",
//     "updated_by": null,
//     "updated_date": null
//   }
// ],
<div className="">

  <div className="mb-4 grid grid-cols-2 gap-4">
    <TextField
      label="Start Date"
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      className="w-full"
      sx={{
        '& .MuiInputBase-root': {
          height: '40px',
        },
        '& .MuiInputLabel-root': {
          color: '#006990',
        },
      }}
    />
    <TextField
      label="End Date"
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      className="w-full"
      sx={{
        '& .MuiInputBase-root': {
          height: '40px',
        },
        '& .MuiInputLabel-root': {
          color: '#006990',
        },
      }}
    />
    <Button
      variant="contained"
      onClick={handleDateFilter}
      className="col-span-2 mt-2"
    >
      Apply Date Filter
    </Button>
  </div>

  {/* Skip Blank Entries */}
  <div className="mb-10 mt-10">
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        checked={skipBlankEntries}
        onChange={() => setSkipBlankEntries(!skipBlankEntries)}
        className="mr-2"
      />
      Skip blank entries
    </label>
  </div>

  {/* Column Selection */}
  <div className="text-lg font-semibold text-gray-700 mb-3 border-b">
    Select Columns
  </div>
  <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
    {['groupName', 'subGroupName', 'accountName', 'amount'].map((column) => (
      <label key={column} className="flex items-center text-gray-600">
        <input
          type="checkbox"
          disabled={true}
          checked={selectedColumns.includes(column)}
          onChange={() => handleColumnChange(column)}
          className="mr-2"
        />
        {formatColumnName(column)}
      </label>
    ))}
  </div>

  <div className=" bg-white py-4  border-t flex justify-between mt-[180px]  ">
    <button
      onClick={handleExportExcel}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
    >
      Export to Excel
    </button>
    <button
      onClick={handleExportPDF}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
    >
      Export to PDF
    </button>
    <button
      onClick={() => handlePreviewPDF(filteredData)}
      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
    >
      Preview PDF
    </button>
  </div>
</div>;

    </div>
  )
}

export default test