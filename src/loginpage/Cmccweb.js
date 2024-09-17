import React, { Fragment } from 'react';
import { Button, Checkbox, Form, Input, Select, Image, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo.jfif';
import './Login.css';





const { Option } = Select;

function Home() {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Initialize the form instance

  const handleButtonClicks = () => {
    navigate('/signup');
  };

  const handleButtonClicked = () => {
    navigate('/password');
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const response = await fetch('https://n2fl6ij215.execute-api.ap-southeast-2.amazonaws.com/DEV/API/LOGIN', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      console.log("message-->", data[0].message);

      if (data[0].message === 'Login Successfull') {
        navigate('/about');
      } else {
        message.error("Login failed, please try again");
        // Optionally reset form fields
        form.resetFields();
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Login failed. Please try again.');
      // Optionally reset form fields
      form.resetFields();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='body'>
      
      <Fragment>
        <div className='login'>
          <Image src={logo} />
          <h2 >CCMC</h2>
        </div>
        <Form
          name="basic"
          form={form} // Attach the form instance
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h3 className='role'>
            <Form.Item
              name="Role"
              rules={[{ required: true, message: 'Please select your Role!' }]}
            >
              <Select placeholder="Select Your Role">
                <Option value="commissioner login">Commissioner Login</Option>
                <Option value="admin">Admin</Option>
                <Option value="bill collector">Bill Collector</Option>
                <Option value="field surveyor">Field Surveyor</Option>
                <Option value="public login">Public Login</Option>
              </Select>
            </Form.Item>
          </h3>
          <div className='loginform' >
            <div><h1>Login</h1></div>
            <div><h3>Don’t have an account? <Button type="link" onClick={handleButtonClicks}>Sign up</Button></h3></div>
            <div>
            <Form.Item
  wrapperCol={{ span: 20 }}
  label="Email"
  name="username"
  labelAlign="left"
  rules={[
    { 
      required: true, 
      message: 'Please input your email!' 
    },
    {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: 'Please enter a valid email address!',
    },
  ]}
>
  <Input />
</Form.Item>

              <Form.Item
                wrapperCol={{ span: 20 }}
                label="Password"
                name="passcode"
                labelAlign="left"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
            </div>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ padding: '20px' }}
            >
              <Checkbox>Remember me</Checkbox>
              <Button type="link" onClick={handleButtonClicked}>Change Password</Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 3 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Log in
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fragment>
    </div>
  );
}

export default Home;