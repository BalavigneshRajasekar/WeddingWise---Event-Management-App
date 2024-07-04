/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Image, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
function Register() {
  const [btnLoading, setBtnLoading] = useState(false);
  const onFinish = async (values) => {
    setBtnLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/register/register",
        values
      );
      message.success(response.data.message);
      setBtnLoading(false);
    } catch (err) {
      message.error(err.response.data.message);
      setBtnLoading(false);
    }
  };
  const onFinishFailed = () => {};
  return (
    <div className="d-flex flex-wrap-reverse p-3 justify-content-between">
      <div
        className=" p-5  bg-light shadow-lg rounded-5 flex-grow-1"
        style={{}}
      >
        <h5 className="border-bottom pb-3 border-success">SignUP</h5>
        <Form
          style={{ marginTop: 40 }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              placeholder="Username"
              prefix={<UserOutlined></UserOutlined>}
            />
          </Form.Item>

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
            already have an acount ?{" "}
            <Link className="link-style-none" to={"/login"}>
              SignIN
            </Link>
          </p>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={btnLoading}
              className="w-100 mt-3"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <img src="../register.avif" alt="" className="img" />
      </div>
    </div>
  );
}

export default Register;
