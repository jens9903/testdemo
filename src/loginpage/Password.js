import React, { Fragment } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/');
  };

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const response = await fetch('https://n2fl6ij215.execute-api.ap-southeast-2.amazonaws.com/DEV/API/CHANGEPASSWORD', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Password change successful:', data);
      message.success('Password change successful!');
      handleButtonClick();
    } catch (error) {
      console.error('Password change failed:', error);
      message.error('Password change failed. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="body">
      <Fragment>
        <div className='tittle' >
          <h2 >Enter your password</h2>
        </div>
        <div >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 600,
              margin: '0 auto',
              background: 'white',
              padding: '20px 70px',
              borderRadius: '20px',
            }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="verifypassword"
              name="verifypassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    </div>
  );
}

export default Home;
