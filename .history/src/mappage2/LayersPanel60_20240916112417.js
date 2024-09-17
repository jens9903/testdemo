import React from 'react';
import { Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import IconSlider60 from './IconSlider60';

const LayersPanel60 = ({
  deliverablesOptions, deliverablesCheckedList, onDeliverablesChange,
  layersOptions, layersCheckedList, onLayersChange,
  usagevariationOptions, usagevariationCheckedList, onUsagevariationChange,
  toggleLayersPanel, isLayersVisible
}) => {
  // Define usage variation options
  const usageVariationOptions = [
    { label: 'Residential to Commercial', value: 'residential_to_commercial' },
    { label: 'Residential to Mixed', value: 'residential_to_mixed' },
    { label: 'Residential to Under Construction', value: 'residential_to_under_construction' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 1000,
        width: '320px',
        height: '760px',
        padding: '20px',
        paddingTop: '30px',
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        borderRadius: '10px'
      }}
    >
      <h3 style={{ margin: 0, color: 'black' }}>Deliverables</h3>
      <hr style={{ margin: '10px 0', borderColor: 'white' }} />
      <Checkbox.Group
        options={deliverablesOptions}
        value={deliverablesCheckedList}
        onChange={onDeliverablesChange}
        style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
      />

      <h3 style={{ margin: '20px 0 0 0', color: 'black' }}>Layers</h3>
      <hr style={{ margin: '10px 0', borderColor: 'white' }} />
      <Checkbox.Group
        options={layersOptions}
        value={layersCheckedList}
        onChange={onLayersChange}
        style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
      />

      <h3 style={{ margin: '20px 0 0 0', color: 'black' }}>Area Variation</h3>
      
      <hr style={{ margin: '10px 0', borderColor: 'white', }} />
      <IconSlider min={0} max={100} /> 
      
      <h3 style={{ margin: '20px 0 0 0', color: 'black' }}>usage Variation</h3>
      <hr style={{ margin: '10px 0', borderColor: 'white' }} />
      <Checkbox.Group
        options={usageVariationOptions}  // Use the new options
        value={usagevariationCheckedList}
        onChange={onUsagevariationChange}
        style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
      />

      <CloseOutlined
        onClick={toggleLayersPanel}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'red',
        }}
      />
    </div>
  );
};

export default LayersPanel;
