import React, { Fragment, useState } from 'react';
import { Button, Form, Select, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo.jfif';
import './Ward.css';

const Page2nd = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]); // State for storing ward options

  const zoneWardMapping = {
    north: [28, 29, 30],
    west: [17, 34, 42, 43, 44, 45, 71, 73],
    central: [31, 32, 46, 47, 66, 70, 80, 81, 82],
  };

  const onFinish = (values) => {
    const { zone, ward } = values;

    console.log('Success:', values);

    // Conditional navigation based on zone and ward selection
    if (zone === 'north' && ward === 28) {
      navigate('/openmap'); // Navigate to open map page for specific ward
    }
    if (zone === 'north' && ward === 29) {
      navigate('map'); // Navigate to open map page for specific ward
    }
     else {
      navigate(`/anotherpage/${zone}/${ward}`); // Navigate to another page dynamically
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Update ward options when zone is selected
  const handleZoneChange = (zone) => {
    setWards(zoneWardMapping[zone] || []); // Update the ward options based on the selected zone
  };

  return (
    <div className="body">
      <Fragment>
        <div className="ward">
          <center><Image width={90} src={logo} /></center>
          <h2>CCMC</h2>
        </div>
        <div className="head">
          <h2>Bill Collector Login</h2>
        </div>

        <div className="wardbox">
          <Form
            name="basic"
            wrapperCol={{
              span: 19,
              offset: 4,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Zone"
              name="zone"
              rules={[
                {
                  required: true,
                  message: 'Please select your zone!',
                },
              ]}
            >
              <Select
                placeholder="Select your Zone"
                onChange={handleZoneChange} // Update wards when zone is selected
              >
                <Select.Option value="north">North</Select.Option>
                <Select.Option value="west">West</Select.Option>
                <Select.Option value="central">Central</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 19, offset: 1 }}
              label="Ward Number"
              name="ward"
              rules={[
                {
                  required: true,
                  message: 'Please select your ward number!',
                },
              ]}
            >
              <Select placeholder="Select your Ward">
                {wards.map((ward) => (
                  <Select.Option key={ward} value={ward}>
                    {ward}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                span: 24,
              }}
            >
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Confirm
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    </div>
  );
};

export default Page2nd;
