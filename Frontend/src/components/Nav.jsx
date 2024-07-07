/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const pages = ["Home", "Catering", "Dj", "Photography", "Decorations"];
const settings = ["Profile", "Add Budget", "Dashboard", "Logout"];

function Nav() {
  const navigate = useNavigate();
  const { fetchUserData } = useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [profileModel, setProfileModel] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [logOut, setLogout] = useState(false);
  const { openModel, setOpenModel } = useContext(AppContext);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event, index) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleProfile = (index) => {
    switch (index) {
      case 0:
        setProfileModel(true);
        break;
      case 1:
        setOpenModel(true);
        break;
      case 2:
        navigate("/dashboard");
        break;
      case 3:
        setLogout(true);

        break;
      default:
        break;
    }
  };
  const handleMenu = (index) => {
    switch (index) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/Catering");
        break;
      case 2:
        navigate("/Dj");
        break;
      case 3:
        navigate("/Photography");
        break;
      case 4:
        navigate("/Decoration");
        break;
      default:
        break;
    }
  };

  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await axios.post(
        "https://eventapi-uk2d.onrender.com/api/budget/add",
        values,
        {
          headers: {
            Authorization: localStorage.getItem("logToken"),
          },
        }
      );
      message.success(response.data.message);
      setOpenModel(false);
      setBtnLoading(false);
      fetchUserData();
    } catch (e) {
      message.error("Failed to add budget");
      setBtnLoading(false);
    }
  };
  const onFinishFailed = () => {};
  const handleLogout = () => {
    localStorage.removeItem("logToken");
    navigate("/");
  };
  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              EVENT MANAGER
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleMenu(index)}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              EVENT MANAGER
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => handleProfile(index)}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Model */}
      <Modal open={logOut} onClose={() => setLogout(false)}>
        <Box className="style">
          <Typography className="p-3">
            Are you sure want to log out ?
          </Typography>
          <Button className="p-3 ms-3" type="primary" onClick={handleLogout}>
            Yes
          </Button>
          <Button className="p-3 ms-3" danger onClick={() => setLogout(false)}>
            No
          </Button>
        </Box>
      </Modal>

      {/* Budget model */}
      <Modal
        open={openModel}
        onClose={() => setOpenModel(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className="style">
          <Typography variant="h6">Enter the budget to track ! </Typography>
          <Form
            style={{ marginTop: 40, minWidth: 300 }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="budget"
              rules={[
                {
                  required: true,
                  message: "please add the budget to track!",
                  type: "Text",
                },
              ]}
            >
              <Input placeholder="Add or Update Budget" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={btnLoading}>
                Add
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => setOpenModel(false)}>cancel</Button>
            </Form.Item>
          </Form>
        </Box>
      </Modal>

      {/* //Profile model */}
      <Modal
        open={profileModel}
        onClose={() => setProfileModel(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className="style">
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              borderBottom: "2px solid green",
              paddingBottom: 2,
            }}
          >
            Profile
          </Typography>
          <div className="p-3">
            <Typography variant="h6" sx={{ padding: 2, fontWeight: 600 }}>
              Name : {localStorage.getItem("userName")}
            </Typography>
            <Typography variant="h6" sx={{ padding: 2, fontWeight: 600 }}>
              Email : {localStorage.getItem("userEmail")}
            </Typography>
            <Typography variant="h6" sx={{ padding: 2, fontWeight: 600 }}>
              Role : {localStorage.getItem("role")}
            </Typography>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Nav;
