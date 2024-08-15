import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Upload } from "antd";
import { Delete, Edit } from "@mui/icons-material";

export default function ViewBeneficiariesTable({
  data,
  columns,
  onEdit,
  shouldShowActions,
  canReplace,
  onDelete,
  fileList,
  handleFileSelect,
  handlePreview,
  handleReplace,
}) {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table
        sx={{ minWidth: 650, boxShadow: "none" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell sx={{ fontWeight: "bold" }} key={index}>
                {column.title}
              </TableCell>
            ))}
            {handleFileSelect && (
              <TableCell sx={{ fontWeight: "bold" }}>Select File</TableCell>
            )}
            {handleFileSelect && (
              <TableCell sx={{ fontWeight: "bold" }}>Selected File</TableCell>
            )}
            {handlePreview && (
              <TableCell sx={{ fontWeight: "bold" }}>Preview</TableCell>
            )}
            {handleReplace && (
              <TableCell sx={{ fontWeight: "bold" }}>Replace</TableCell>
            )}
            {shouldShowActions && (
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length < 1 && (
            <TableRow key={"empty-row"}>
              <TableCell
                key={"empty-cell"}
                colSpan={columns.length + 1}
                rowSpan={2}
                align="center"
              >
                <small> No Data Available</small>
              </TableCell>
            </TableRow>
          )}
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, index) => (
                <TableCell key={index}>{row[column.dataIndex]}</TableCell>
              ))}
              {handleFileSelect && (
                <TableCell>
                  <Upload
                    name="file"
                    showUploadList={false}
                    accept={row.extensions}
                    onChange={(info) => handleFileSelect(info, row)}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </TableCell>
              )}
              {handleFileSelect && (
                <TableCell>
                  {fileList.find((f) => f.uid === row.id)
                    ? fileList.find((f) => f.uid === row.id).name
                    : "No file selected"}
                </TableCell>
              )}
              {handlePreview && (
                <TableCell key={`preview_${rowIndex}`}>
                  <Button
                    type="primary"
                    className="bg-primary text-white hover:bg-primary-dark"
                    onClick={() =>
                      handleFileSelect
                        ? handlePreview(fileList.find((f) => f.uid === row.id))
                        : handlePreview(row)
                    }
                    disabled={
                      handleFileSelect &&
                      !fileList.find((f) => f.uid === row.id)
                    }
                  >
                    Preview
                  </Button>
                </TableCell>
              )}
              {handleReplace && (
                <TableCell key={`replace_${rowIndex}`}>
                  <Button
                    type="primary"
                    className="bg-primary text-white hover:bg-primary-dark"
                    onClick={() => handleReplace(row)}
                    disabled={canReplace}
                  >
                    Replace
                  </Button>
                </TableCell>
              )}
              {shouldShowActions && (
                <TableCell>
                  <Edit
                    onClick={() => onEdit(row)}
                    className="text-xl mx-3 cursor-pointer text-primary"
                  />
                  <Popconfirm
                    placement="topLeft"
                    title="Delete Record"
                    description={`Are you sure to delete ${row.display_name}???`}
                    onConfirm={() => onDelete(row)}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                    icon={
                      <QuestionCircleOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    }
                  >
                    <Delete className="text-xl cursor-pointer mx-2 text-red-600" />
                  </Popconfirm>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
