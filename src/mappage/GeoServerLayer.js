import { useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import 'ol/ol.css';
import './Map.css';
 
const GeoServerLayer = ({ map, visible, layerName }) => {
  useEffect(() => {
    if (!map) return;
 
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: 'https://agrex-demo.farmwiseai.com/geoserver/ccmcproject/wms?',
        params: {
          'LAYERS': layerName,
          'TILED': true,
         
          'FORMAT': 'image/png',
          'TRANSPARENT': true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: visible,
    });
 
    map.addLayer(wmsLayer);
 
    const container = document.createElement('div');
    container.className = 'ol-popup';
    const content = document.createElement('div');
    container.appendChild(content);
 
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
 
    map.addOverlay(overlay);
 
    // Add click event listener for GetFeatureInfo
    const handleMapClick = async (event) => {
      const viewResolution = map.getView().getResolution();
      const url = wmsLayer
        .getSource()
        .getFeatureInfoUrl(
          event.coordinate,
          viewResolution,
          'EPSG:3857',
          { 'INFO_FORMAT': 'application/json' }
        );
 
      if (url) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log("Feature Info Data:", data);
 
          if (data.features && data.features.length > 0) {
            const featureInfo = data.features[0].properties;
 
            const ownerName = featureInfo.O_OWNER_NA || 'N/A';
            const GIS_ID= featureInfo.GIS_ID|| 'N/A';
            const BuildUse = featureInfo.BuildUse|| 'N/A';
            const ConstnType = featureInfo.ConstnType || 'N/A';
            const variation = featureInfo.variation || 'N/A';
            const TotalFloor = featureInfo.TotalFloor || 'N/A';
            const gisArea = featureInfo.GIS_AREA || 'N/A';
            const   Drone_Area = featureInfo. Drone_Area || 'N/A';
 
            const popupContent = `
              <div class="custom-popup">
                <button class="popup-close-btn">&times;</button>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzkngs437jFKwKltyzGlk1_mc50hzg_VvB-Q&s' >
                <p><strong>Owner:</strong> ${ownerName}</p>
                <p><strong>GisID:</strong> ${GIS_ID}</p>
                <hr>
                <p><strong>Building Usage:</strong> ${BuildUse}</p>
                <p><strong>Construction Type:</strong> ${ConstnType}</p>
                <p><strong>Variation:</strong> ${variation}</p>
                <hr>
                <p><strong>FLOOR COUNT (sq ft):</strong> ${TotalFloor}</p>
                <p><strong>GIS Area (sq ft):</strong> ${gisArea}</p>
                <p><strong>Drone Survey (sq ft):</strong> ${  Drone_Area}</p>
                <button id="direction-btn">Get Directions</button>
              </div>
            `;
 
            content.innerHTML = popupContent;
            overlay.setPosition(event.coordinate);
 
            document.getElementById('direction-btn').addEventListener('click', () => {
              // Convert the event.coordinate to [lon, lat] in EPSG:4326
              const lonLat = toLonLat(event.coordinate);
              const googleMapsUrl = `https://www.google.com/maps?q=${lonLat[1]},${lonLat[0]}`;
              window.open(googleMapsUrl, '_blank');
            });
 
            document.querySelector('.popup-close-btn').addEventListener('click', () => {
              overlay.setPosition(undefined); // Hide the popup
            });
 
          } else {
            console.log("No data available at this location.");
          }
        } catch (error) {
          console.error("Error fetching feature info:", error);
          alert("Error fetching feature info. Check the console for more details.");
        }
      }
    };
 
    map.on('singleclick', handleMapClick);
 
    return () => {
      map.un('singleclick', handleMapClick);
      map.removeLayer(wmsLayer); // Clean up when the layer is no longer needed
      map.removeOverlay(overlay);
    };
  }, [map, visible, layerName]);
 
  return null;
};
 
export default GeoServerLayer;
 