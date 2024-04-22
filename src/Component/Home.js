import Axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Upload, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Navbar from "./์Navbar";
import "../style/Home.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
function Home() {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isModalOpenModaldata, setisModalOpenModaldata] = useState(false);
  const [datacsv, setdatacsv] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (token) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    Axios.post("http://localhost:3001/authen").then(
      (result) => {
        if (isLoggedIn === "true") {
          message.success("เข้าสู่ระบบสำเร็จ");
        } else {
          localStorage.removeItem("token");
          navigate("/Login");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    setUploading(true);

    const response = Axios.post("http://localhost:3001/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        setFileList([]);
        message.success("อัปโหลดเสร็จสิ้น");
      })
      .catch(() => {
        message.error("อัปโหลดผิดพลาด");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  const getCsv = async () => {
    showModal();
    try {
      const response = await Axios.get("http://localhost:3001/showData");
      setdatacsv(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching CSV data: ", error);
    }
  };
  const showModal = () => {
    setisModalOpenModaldata(true);
  };
  const handleOk = () => {
    setisModalOpenModaldata(false);
  };
  const handleCancel = () => {
    setisModalOpenModaldata(false);
  };
  return (
    <>
      <Navbar />
      <div className="AreaHome">
        <div className="bodyHome">
          <h3>ทำการอัปโหลดไฟล์</h3>
          <Upload {...props}>
            <Button style={{ marginBottom: "20px" }} icon={<UploadOutlined />}>
              เลือกไฟล์
            </Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{
              marginBottom: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            {uploading ? "กำลังโหลด" : "ส่งไฟล์อัปโหลด"}
          </Button>
          <Button
            style={{ marginBottom: "20px" }}
            type="primary"
            onClick={getCsv}
          >
            ดูข้อมูล
          </Button>
        </div>
        <div className="Modal">
          <Modal
            title="ตารางผู้ใช้งานคอม"
            open={isModalOpenModaldata}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อผู้ใช้</TableCell>
                    <TableCell align="right">แผนก</TableCell>
                    <TableCell align="right">ใบอนุญาต</TableCell>
                    <TableCell align="right">ติดตั้งแล้ว</TableCell>
                    <TableCell align="right">ยี่ห้อ</TableCell>
                    <TableCell align="right">โมเดล</TableCell>
                    <TableCell align="right">หมายเลขซีเรียล</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datacsv.map((item, index) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={item.ID}
                    >
                      <TableCell align="right">{item.username}</TableCell>
                      <TableCell align="right">{item.department}</TableCell>
                      <TableCell align="right">{item.license}</TableCell>
                      <TableCell align="right">{item.Installed}</TableCell>
                      <TableCell align="right">{item.brand}</TableCell>
                      <TableCell align="right">{item.model}</TableCell>
                      <TableCell align="right">{item.serial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Modal>
        </div>
      </div>
    </>
  );
}
export default Home;
