import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Checkbox, Slider } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import './Map.css';
 
// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
 
// GeoServer Layer Component with Click Handler for Feature Info
const GeoServerLayer = ({ visible, layerName }) => {
  const map = useMap();
  const geoServerLayerRef = useRef(null);
 
  useEffect(() => {
    if (visible && !geoServerLayerRef.current) {
      geoServerLayerRef.current = L.tileLayer.wms('http://13.127.98.21:8080/geoserver/CMCC/wms?', {
        layers: layerName,
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
      });
      geoServerLayerRef.current.addTo(map);
 
      map.on('click', handleMapClick);
    } else if (!visible && geoServerLayerRef.current) {
      map.off('click', handleMapClick);
      map.removeLayer(geoServerLayerRef.current);
      geoServerLayerRef.current = null;
    }
  }, [visible, layerName, map]);
 
  const handleMapClick = async (e) => {
    const { latlng } = e;
    const url = `http://13.127.98.21:8080/geoserver/CMCC/wms?service=WMS&version=1.1.0&request=GetFeatureInfo&layers=${layerName}&query_layers=${layerName}&bbox=${map.getBounds().toBBoxString()}&width=${map.getSize().x}&height=${map.getSize().y}&srs=EPSG:4326&info_format=application/json&x=${Math.floor(map.latLngToContainerPoint(latlng).x)}&y=${Math.floor(map.latLngToContainerPoint(latlng).y)}`;
 
    console.log("GetFeatureInfo URL:", url);
 
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Feature Info Data:", data);
 
      if (data.features && data.features.length > 0) {
        const featureInfo = data.features[0].properties;
 
        const ownerName = featureInfo.O_OWNER_NA || 'N/A';
        const assessment = featureInfo.Assessment || 'N/A';
        const buildingUsage = featureInfo.BUILD_USAG || 'N/A';
        const constructionType = featureInfo.CONSTR_TYP || 'N/A';
        const variation = featureInfo.variation || 'N/A';
        const misArea = featureInfo.MIS_AREA || 'N/A';
        const gisArea = featureInfo.GIS_AREA || 'N/A';
        const dAreaSqf = featureInfo.D_AREA_SQF || 'N/A';
 
        const popupContent = `
          <div class="custom-popup">
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Y65EnAOrG58xjl_q2JtDSkVblHEBxBuVSw&s'style:{{width:100px}}>
           
            <p><strong></strong> ${ownerName}</p>
            <p><strong></strong> ${assessment}</p>
            <hr>
            <p><strong>Building Usage:</strong> ${buildingUsage}</p>
            <p><strong>Construction Type:</strong> ${constructionType}</p>
            <p><strong>Variation:</strong> ${variation}</p>
            <hr>
            <p><strong>MIS Area (sq ft):</strong> ${misArea}</p>
            <p><strong>GIS Area (sq ft):</strong> ${gisArea}</p>
            <p><strong>Drone Survey (sq ft):</strong> ${dAreaSqf}</p>
            <button id="direction-btn">Get Directions</button>
          </div>
        `;
 
        const popup = L.popup()
          .setLatLng(latlng)
          .setContent(popupContent)
          .openOn(map);
 
        // Add event listener for the Direction button
        popup.getElement().querySelector('#direction-btn').addEventListener('click', () => {
          const googleMapsUrl = `https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`;
          window.open(googleMapsUrl, '_blank');
        });
      } else {
        console.log("No data available at this location.");
      }
    } catch (error) {
      console.error("Error fetching feature info:", error);
      alert("Error fetching feature info. Check the console for more details.");
    }
  };
 
  return null; // This component does not render any JSX
};
 
 
// IconSlider Component
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
 
// Main MapComponent
const MapComponent = () => {
  const [deliverablesCheckedList, setDeliverablesCheckedList] = useState([]);
  const [layersCheckedList, setLayersCheckedList] = useState([]);
  const [usagevariationCheckedList, setUsagevariationCheckedList] = useState([]);
  const [deliverablesCheckAll, setDeliverablesCheckAll] = useState(false);
  const [layersCheckAll, setLayersCheckAll] = useState(false);
  const [usagevariationCheckAll, setUsagevariationCheckAll] = useState(false);
  const [isLayersVisible, setIsLayersVisible] = useState(false);
 
  const deliverablesOptions = ['Area variation above 50%', 'Usage variation', 'New Bills'];
  const layersOptions = ['Survey completed', 'Building layers', 'Road layers', 'Drone image', 'Ward boundary', 'Satellite image'];
  const usagevariationOptions = ['Usage variation 1', 'Usage variation 2', 'Usage variation 3'];
 
  const toggleLayersPanel = () => {
    setIsLayersVisible(!isLayersVisible);
  };
 
  const onDeliverablesChange = (list) => {
    setDeliverablesCheckedList(list);
    setDeliverablesCheckAll(list.length === deliverablesOptions.length);
  };
 
  const onDeliverablesCheckAllChange = (e) => {
    setDeliverablesCheckedList(e.target.checked ? deliverablesOptions : []);
    setDeliverablesCheckAll(e.target.checked);
  };
 
  const onLayersChange = (list) => {
    setLayersCheckedList(list);
    setLayersCheckAll(list.length === layersOptions.length);
  };
 
  const onLayersCheckAllChange = (e) => {
    setLayersCheckedList(e.target.checked ? layersOptions : []);
    setLayersCheckAll(e.target.checked);
  };
 
  const onUsagevariationChange = (list) => {
    setUsagevariationCheckedList(list);
    setUsagevariationCheckAll(list.length === usagevariationOptions.length);
  };
 
  const onUsagevariationCheckAllChange = (e) => {
    setUsagevariationCheckedList(e.target.checked ? usagevariationOptions : []);
    setUsagevariationCheckAll(e.target.checked);
  };
 
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
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
      backgroundColor:'#097969',
      boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
      borderRadius:'10px'
    }}
  >
    {/* Deliverables Section */}
    <h3 style={{ margin: 0, color:'white' }}>Deliverables</h3>
    <hr style={{ margin: '10px 0', borderColor: 'white' }} />
    <Checkbox.Group
      options={deliverablesOptions}
      value={deliverablesCheckedList}
      onChange={onDeliverablesChange}
      style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
    />
 
    {/* Layers Section */}
    <h3 style={{ margin: '20px 0 0 0', color:'white' }}>Layers</h3>
    <hr style={{ margin: '10px 0', borderColor: 'white' }} />
    <Checkbox.Group
      options={layersOptions}
      value={layersCheckedList}
      onChange={onLayersChange}
      style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}
    />
 
    {/* Usage Variation Section */}
    <h3 style={{ margin: '20px 0 0 0', color:'white' }}>Usage Variation</h3>
    <hr style={{ margin: '10px 0', borderColor: 'white' }} />
    <IconSlider min={0} max={100} />
    <Checkbox.Group
      options={usagevariationOptions}
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
)}
 
     
 
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer
          center={[11.0168, 76.9558]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=kdDsawZudvKORHRC6nip"
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
          />
 
          <GeoServerLayer visible={layersCheckedList.includes('Building layers')} layerName="CMCC:coimb_survey_building" />
          <GeoServerLayer visible={layersCheckedList.includes('Road layers')} layerName="CMCC:coimb_road_w68" />
          <GeoServerLayer visible={layersCheckedList.includes('Drone image')} layerName="coimb_drone_image_w68" />
          <GeoServerLayer visible={layersCheckedList.includes('Ward boundary')} layerName="coimb_ward_boundary" />
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </div>
  );
};
 
export default MapComponent;