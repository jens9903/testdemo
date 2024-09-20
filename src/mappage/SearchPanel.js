import React, { useState } from 'react';
import { Input, Select, Button, Radio } from 'antd';
import { CloseOutlined } from '@ant-design/icons'; // Import the close icon

const { Option } = Select;

const SearchPanel = ({ isVisible, toggleSearchPanel }) => {
  const [searchType, setSearchType] = useState('gis'); // Manage whether to show GIS ID or Road Name
  const [searchValue, setSearchValue] = useState('');  // State to manage the search input

  // Function to handle search type change (GIS ID or Road Name)
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue(''); // Clear search value when switching types
  };

  // Function to handle the input value change
  const handleSearchInputChange = (value) => {
    setSearchValue(value);
  };

  // Define the options based on the selected search type
  const options = searchType === 'gis'
    ? [
        { value: 'gis1', label: 'GIS Option 1' },
        { value: 'gis2', label: 'GIS Option 2' },
      ]
    : [
        { value: 'road1', label: 'Road 1' },
        { value: 'road2', label: 'Road 2' },
      ];

  return (
    <>
      {isVisible && (
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
          {/* Close Icon at the top-right corner */}
          <CloseOutlined
            onClick={toggleSearchPanel}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'gray',

            }}
          />

        

          {/* Radio buttons to choose between GIS ID or Road Name */}
          <Radio.Group
            onChange={handleSearchTypeChange}
            value={searchType}
            style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-around' }}
          >
            <Radio.Button value="gis">Building</Radio.Button>
            <Radio.Button value="road">Road Name</Radio.Button>
          </Radio.Group>

          {/* Single search box with dropdown options */}
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
    </>
  );
};

export default SearchPanel;
