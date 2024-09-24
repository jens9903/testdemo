import React, { useState, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import GeoServerLayer from './GeoServerLayer';
import LayersPanel from './LayersPanel';
import { MenuOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Select, Button } from 'antd';
 
const { Option } = Select;
 
const MapComponent = () => {
  const [deliverablesCheckedList, setDeliverablesCheckedList] = useState([]);
  const [layersCheckedList, setLayersCheckedList] = useState(['boundary layers']); // Start with boundary layers checked
  const [usagevariationCheckedList, setUsagevariationCheckedList] = useState([]);
  const [isLayersVisible, setIsLayersVisible] = useState(false);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false); // State to toggle search panel
  const [map, setMap] = useState(null);
  const [searchValue, setSearchValue] = useState(''); // State for search input
 
  const deliverablesOptions = ['Area variation above 50%', 'Usage variation', 'New Bills'];
  const layersOptions = ['boundary layers', 'Building layers', 'Road layers', 'Drone image', 'Ward boundary', 'Satellite image'];
  const usagevariationOptions = ['Residential to commercial', 'Residential to mixed', 'Residential to under construction'];
 
  const toggleLayersPanel = () => {
    setIsLayersVisible(!isLayersVisible);
    setIsSearchPanelVisible(false); // Ensure search panel is closed when toggling layers panel
  };
 
  const toggleSearchPanel = () => {
    setIsSearchPanelVisible(!isSearchPanelVisible);
    setIsLayersVisible(false); // Hide layers panel when search panel is open
  };
 
  const onDeliverablesChange = (list) => {
    setDeliverablesCheckedList(list);
  };
 
  const onLayersChange = (list) => {
    setLayersCheckedList(list);
  };
 
  const onUsagevariationChange = (list) => {
    setUsagevariationCheckedList(list);
  };
 
  useEffect(() => {
    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=kdDsawZudvKORHRC6nip',
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([76.9558, 11.0168]),
        zoom: 16,
      }),
    });
 
    setMap(initialMap);
 
    return () => {
      initialMap.setTarget(null); // Clean up the map on unmount
    };
  }, []);
 
  return (
    <div className='button1'>
      {/* Button to toggle layers panel */}
      {!isLayersVisible && !isSearchPanelVisible && (
        <button
          onClick={toggleLayersPanel}
          style={{
            position: 'absolute',
            top: '10px',
            left: '45px',
            zIndex: 1000,
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <MenuOutlined style={{ fontSize: '20px' }} />
        </button>
      )}
 
     
   
 
      {/* Layers Panel */}
      {isLayersVisible && (
        <LayersPanel
          deliverablesOptions={deliverablesOptions}
          deliverablesCheckedList={deliverablesCheckedList}
          onDeliverablesChange={onDeliverablesChange}
          layersOptions={layersOptions}
          layersCheckedList={layersCheckedList}
          onLayersChange={onLayersChange}
          usagevariationOptions={usagevariationOptions}
          usagevariationCheckedList={usagevariationCheckedList}
          onUsagevariationChange={onUsagevariationChange}
          toggleLayersPanel={toggleLayersPanel}
          isLayersVisible={isLayersVisible}
        />
      )}
 
      {/* Search Panel */}
      {isSearchPanelVisible && (
        <div
     
        >
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
          <h3>Search Building or Road</h3>
 
          {/* Search Input */}
          <Select
            showSearch
            value={searchValue}
            placeholder="Search by Building or Road"
            onChange={(value) => setSearchValue(value)}
            style={{ width: '100%', marginBottom: '20px' }}
            options={[
              { value: 'Building1', label: 'Building 1' },
              { value: 'Building2', label: 'Building 2' },
              { value: 'Road1', label: 'Road 1' },
              { value: 'Road2', label: 'Road 2' },
            ]}
          />
 
          {/* Search Button */}
         
        </div>
      )}
 
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
 
      {/* GeoServer Layers */}
      {layersCheckedList.includes('Building layers') && <GeoServerLayer map={map} visible={true} layerName="ccmcproject:Ward_28_Buildings" />}
      {layersCheckedList.includes('Road layers') && <GeoServerLayer map={map} visible={true} layerName="ccmcproject:Ward_028_Road" />}
      {layersCheckedList.includes('boundary layers') && <GeoServerLayer map={map} visible={true} layerName="ccmcproject:coimb_ward_boundary" />}
    </div>
  );
};
 
export default MapComponent;