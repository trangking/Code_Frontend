import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import Axios from "axios";
import { Modal, Form, Input, Button, Alert, message } from "antd";
import Marquee from "react-fast-marquee";

const Login = () => {
  const [username, setusername] = useState("");
  const [userpassword, setuserpassword] = useState("");
  const [addusername, setaddusername] = useState("");
  const [adduserpassword, setadduserpassword] = useState("");
  const [adduser, setadduser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
 
  const CheckLogin = async () => {
    const sentbackend = {
      username: username,
      userpassword: userpassword,
    };
    await Axios.post("http://localhost:3001/login", sentbackend)
      .then((data) => {
        if (data.data.status === "ok") {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("isLoggedIn", "true");
          navigate("/Home");
        } else {
          setOpenAlert(true);
          console.log(openAlert);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const createuser = () => {
    if (adduserpassword.length < 8) {
      message.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    } else {
      Axios.post("http://localhost:3001/create", {
        name: addusername,
        password: adduserpassword,
      }).then(() => {
        setadduser([
          ...adduser,
          {
            name: addusername,
            password: adduserpassword,
          },
          message.success("สมัครสมาชิกสำเร็จ"),
          setIsModalOpen(false),
          setadduser(""),
          setadduserpassword(""),
        ]);
      });
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setadduser("");
    setadduserpassword("");
  };
  const handlePasswordBlur = (event) => {
    const newPassword = event.target.value;
    if (newPassword.length < 8) {
      message.error("กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร");
    }
  };
  return (
    <div className="body">
      <div className="wrapper">
        <h1>ยินดีต้อนรับ</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="ชื่อผู้ใข้งาน"
            value={username}
            onChange={(event) => {
              setusername(event.target.value);
            }}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={userpassword}
            minLength={8}
            onInvalid={(e) => {
              e.target.setCustomValidity("กรุณากรอกรหัสผ่านมากกว่า 8 ตัวอักษร");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            onChange={(event) => {
              setuserpassword(event.target.value);
            }}
            onBlur={handlePasswordBlur}
            required
          />
          <i className="bx bxs-lock-alt"></i>
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            จดจำการลงชื่อใช้งานของฉัน
          </label>
        </div>
        <button type="submit" className="btn" onClick={CheckLogin}>
          เข้าสู่ระบบ
        </button>
        <div className="register-link">
          <p>
            ไม่มีบัญชีใช่ไหม? <button onClick={showModal}>สร้างเลย!</button>
          </p>
        </div>
        {openAlert && (
          <Alert
            banner
            message={
              <Marquee pauseOnHover gradient={false}>
                ไม่มีข้อมูลการล็อคอินในระบบของเรา
              </Marquee>
            }
          />
        )}
        <Modal
          title="สมัครสมาชิก"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="areamodal">
            <Form.Item>
              <label>ชื่อผู้ใช้</label>
              <Input
                onChange={(event) => {
                  setaddusername(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <label>รหัสผ่าน</label>
              <Input
                onChange={(event) => {
                  setadduserpassword(event.target.value);
                }}
                type="password"
              />
            </Form.Item>
          </div>
          <div className="footermodal">
            <Button
              onClick={handleCancel}
              type="dashed"
              style={{ marginRight: "5px" }}
              danger
            >
              ยกเลิก
            </Button>
            <Button
              type="dashed"
              style={{ borderColor: "green", color: "green" }}
              onClick={createuser}
            >
              ส่ง
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
