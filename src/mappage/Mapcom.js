import React, { useState, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import GeoServerLayer from './GeoServerLayer';
import LayersPanel from './LayersPanel';
import SearchPanel from './SearchPanel'; // Fix: Change the import to SearchPanel
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';

const MapComponent = () => {
  const [deliverablesCheckedList, setDeliverablesCheckedList] = useState([]);
  const [layersCheckedList, setLayersCheckedList] = useState([]);
  const [usagevariationCheckedList, setUsagevariationCheckedList] = useState([]);
  const [isLayersVisible, setIsLayersVisible] = useState(false);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false); // State to toggle search panel visibility
  const [map, setMap] = useState(null);

  const deliverablesOptions = ['Area variation above 50%', 'Usage variation', 'New Bills'];
  const layersOptions = ['Survey completed', 'Building layers', 'Road layers', 'Drone image', 'Ward boundary', 'Satellite image'];
  const usagevariationOptions = ['Residential to commercial', 'Residential to mixed', 'Residential to under construction'];

  const toggleLayersPanel = () => {
    setIsLayersVisible(!isLayersVisible);
  };

  const toggleSearchPanel = () => {
    setIsSearchPanelVisible(!isSearchPanelVisible);
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
      {!isLayersVisible && (
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

      {/* Search Panel Icon (Right Side) */}
      <button
        onClick={toggleSearchPanel}
        style={{
          position: 'absolute',
          top: '10px',
          right: '45px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
      >
        <SearchOutlined style={{ fontSize: '20px' }} />
      </button>

      {/* Render the SearchPanel */}
      <SearchPanel isVisible={isSearchPanelVisible} toggleSearchPanel={toggleSearchPanel} />

      <div id="map" style={{ height: '100%', width: '100%' }}></div>

      {/* GeoServer Layers */}
      
    </div>
  );
};

export default MapComponent;
