/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Form, Input, Button, Checkbox, Image, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import AppContext from "antd/es/app/context";

function Login() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(AppContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login/login",
        values
      );
      message.success(response.data.message);
      setBtnLoading(false);

      localStorage.setItem("logToken", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.id);

      navigate("/home");
      console.log("home");
    } catch (err) {
      message.error(err.response.data.message);
      setBtnLoading(false);
    }
  };
  const onFinishFailed = async () => {};
  return (
    <div className="vh-100 bg-dark">
      <div className=" p-5  form bg-light shadow-lg rounded-5">
        <h5 className="border-bottom pb-3 border-success">SignIN</h5>
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
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <Input placeholder="email" prefix={<MailOutlined></MailOutlined>} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
                min: "",
              },
            ]}
          >
            <Input.Password
              placeholder="password"
              prefix={<LockOutlined></LockOutlined>}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <p>
            Dont have an account ?{" "}
            <Link className="link-style-none" to={"/register"}>
              Register
            </Link>
          </p>
          <a>Forgot password ?</a>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={btnLoading}
              className="w-100 mt-3"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
