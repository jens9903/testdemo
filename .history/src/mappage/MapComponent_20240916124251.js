import React, { useState, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, transformExtent } from 'ol/proj';
import GeoServerLayer from './GeoServerLayer';
import LayersPanel from './LayersPanel';
import { MenuOutlined } from '@ant-design/icons';

const MapComponent = () => {
  const [layersCheckedList, setLayersCheckedList] = useState([]);
  const [isLayersVisible, setIsLayersVisible] = useState(false);
  const [map, setMap] = useState(null);
  const [buildingLayerExtent, setBuildingLayerExtent] = useState(null);

  const layersOptions = ['Survey completed', 'Building layers', 'Road layers', 'Drone image', 'Ward boundary', 'Satellite image'];

  const toggleLayersPanel = () => {
    setIsLayersVisible(!isLayersVisible);
  };

  const onLayersChange = (list) => {
    setLayersCheckedList(list);

    if (map && list.includes('Building layers') && buildingLayerExtent) {
      const view = map.getView();
      const transformedExtent = transformExtent(buildingLayerExtent, 'EPSG:4326', 'EPSG:3857');
      view.fit(transformedExtent, { duration: 1000 });
    }
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
      {!isLayersVisible && (
        <button
          onClick={toggleLayersPanel}
          style={{
            position: 'absolute',
            top: '10px',
            left: '30px',
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

      {isLayersVisible && (
        <LayersPanel
          layersOptions={layersOptions}
          layersCheckedList={layersCheckedList}
          onLayersChange={onLayersChange}
          toggleLayersPanel={toggleLayersPanel}
          isLayersVisible={isLayersVisible}
        />
      )}

      <div id="map" style={{ height: '100%', width: '100%' }}></div>

      {/* GeoServer Layers */}
      {layersCheckedList.includes('Building layers') && (
        <GeoServerLayer
          map={map}
          visible={true}
          layerName="CCMC_DEMO:Building_final"
          onExtentReady={(extent) => setBuildingLayerExtent(extent)}
        />
      )}
    </div>
  );
};

export default MapComponent;
