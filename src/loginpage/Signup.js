import React, { Fragment } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Option } = Select;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Option value="91">+91</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/');
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const response = await fetch('https://n2fl6ij215.execute-api.ap-southeast-2.amazonaws.com/DEV/API/SIGNUP', {
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
      console.log('Signup successful:', data);
      message.success('Signup successful!');
      handleButtonClick();
    } catch (error) {
      console.error('Signup failed:', error);
      message.error('Signup failed. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='body'>
      <Fragment>
        <div className='tittle'>
          <h2 >Signup into CCMC</h2>
        </div>
        <div >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
              margin: '0 auto',
              background: 'white',
              padding: '20px 70px',
              borderRadius: '20px',
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="user_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="mail"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="mobile_number"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: 'Please select your gender!',
                },
              ]}
            >
              <Select placeholder="Select an option" allowClear>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Role"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: 'Please select your role!',
                },
              ]}
            >
              <Select placeholder="Select an option" allowClear>
                <Option value="commissioner login">Commissioner Login</Option>
                <Option value="admin">Admin</Option>
                <Option value="bill collector">Bill Collector</Option>
                <Option value="field surveyor">Field Surveyor</Option>
                <Option value="public login">Public Login</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            {/* /*<Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item> */}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    </div>
  );
}

export default Home;

