import "../style/Navbar.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };
  return (
    <div className="Navbar">
      <a>ยินดีต้อนรับ</a>
      <Button onClick={handleLogout} type="primary" danger>
        ออกจากระบบ
      </Button>
    </div>
  );
};
export default Navbar;
