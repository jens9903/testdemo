import React, { useState } from 'react';
import { Slider } from 'antd';
 
const IconSlider = ({ max, min }) => {
  const [value, setValue] = useState(0);
 
  const marks = {
    0: '0%',
    50: '50%',
    100: 'Violation',
  };
 
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>Area Variation</h4>
      <Slider
        min={min}
        max={max}
        marks={marks}
        onChange={setValue}
        value={value}
        style={{ width: '90%' }}
      />
    </div>
  );
};
 
export default IconSlider;