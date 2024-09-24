import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Select, Radio } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import IconSlider from './IconSlider';
 
const { Option } = Select;
 
const MergedLayersAndSearchPanel = ({
  deliverablesOptions, deliverablesCheckedList, onDeliverablesChange,
  layersOptions, layersCheckedList, onLayersChange,
  usagevariationOptions, usagevariationCheckedList, onUsagevariationChange,
  map // Pass the map instance as a prop
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Toggle for search panel
  const [searchType, setSearchType] = useState('gis'); // Manage whether to show GIS ID or Road Name
  const [searchValue, setSearchValue] = useState('');  // State to manage the search input
  const [options, setOptions] = useState([]); // State to manage dropdown options
 
  // Function to handle search type change (GIS ID or Road Name)
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue(''); // Clear search value when switching types
    fetchSearchOptions(e.target.value); // Fetch relevant options (GIS ID or Road Name)
  };
 
  // Function to handle the input value change
  const handleSearchInputChange = (value) => {
    setSearchValue(value);
  };
 
  // Function to fetch GIS_ID or RoadName values from WMS layer
  const fetchSearchOptions = async (type) => {
    try {
      const wmsUrl = 'http://13.127.98.21:8080/geoserver/ccmcproject/wms?'; // Base WMS URL
      const params = new URLSearchParams({
        service: 'WFS', // WFS request to get feature data
        version: '1.1.0',
        request: 'GetFeature',
        typeName: 'ccmcproject:Ward_28_Buildings', // Specify your layer name
        outputFormat: 'application/json',
      });
     
      const response = await fetch(`${wmsUrl}${params.toString()}`);
      const data = await response.json();
 
      if (data && data.features) {
        // Use a Set to keep track of unique values
        const uniqueValues = new Set();
        const newOptions = data.features.map(feature => {
          const value = type === 'gis' ? feature.properties.GIS_ID : feature.properties.RoadName;
 
          // Only add unique values to the set
          if (value && !uniqueValues.has(value)) {
            uniqueValues.add(value);
            return {
              value,
              label: value,
            };
          }
          return null; // Return null for duplicates
        }).filter(option => option); // Filter out null values
 
        setOptions(newOptions);
      }
    } catch (error) {
      console.error('Error fetching WMS layer data:', error);
    }
  };
 
 
  // Toggle the visibility of the search panel inside the layers box
  const toggleSearchPanel = () => {
    setIsSearchVisible(!isSearchVisible);
    fetchSearchOptions(searchType); // Fetch options when panel is opened
  };
 
  return (
    <>
      {/* Layers Panel on the Left */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: 1000,
          width: '320px',
          height: '760px',
          padding: '20px',
          backgroundColor: 'white',
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          borderRadius: '10px',
          overflowY: 'scroll',
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
        <hr style={{ margin: '10px 0', borderColor: 'white' }} />
        <IconSlider min={0} max={100} />
 
        <h3 style={{ margin: '20px 0 0 0', color: 'black' }}>Usage Variation</h3>
        <hr style={{ margin: '10px 0', borderColor: 'white' }} />
        <Checkbox.Group
          options={usagevariationOptions}
          value={usagevariationCheckedList}
          onChange={onUsagevariationChange}
          style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}
        />
 
        {/* Search Icon on the top-right corner of the Layers box */}
        <SearchOutlined
          onClick={toggleSearchPanel}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'gray',
          }}
        />
 
        {/* Search Panel inside the Layers Box */}
        {isSearchVisible && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              zIndex: 1000,
              width: '320px',
              backgroundColor: '#FFFAFA',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
            }}
          >
            {/* Close Icon for Search Panel */}
            <CloseOutlined
              onClick={toggleSearchPanel}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'red',
              }}
            />
 
            {/* Search Type Selection */}
            <h3 style={{ marginBottom: '20px', color: 'black' }}>Search</h3>
            <Radio.Group
              onChange={handleSearchTypeChange}
              value={searchType}
              style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-around' }}
            >
              <Radio.Button value="gis">Building</Radio.Button>
              <Radio.Button value="road">Road Name</Radio.Button>
            </Radio.Group>
 
            {/* Search Input */}
            <Select
              showSearch
              value={searchValue}
              placeholder={`Search by ${searchType === 'gis' ? 'GIS ID' : 'Road Name'}`}
              onChange={handleSearchInputChange}
              style={{ width: '100%', marginBottom: '20px' }}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={options}
            />
 
            {/* Search Button */}
            <Button type="primary" style={{ width: '100%', marginBottom: '10px' }}>
              Search
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
 
export default MergedLayersAndSearchPanel;