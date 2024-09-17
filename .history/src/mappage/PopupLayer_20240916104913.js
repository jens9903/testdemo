import { useEffect } from 'react';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import './Map.css';
import PopupLayer 

const PopupLayer = ({ map, wmsLayer }) => {
  useEffect(() => {
    if (!map || !wmsLayer) return;

    // Create popup container and content
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
          { INFO_FORMAT: 'application/json' }
        );

      if (url) {
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
                <button class="popup-close-btn">&times;</button>
                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzkngs437jFKwKltyzGlk1_mc50hzg_VvB-Q&s' >
                <p><strong>Owner:</strong> ${ownerName}</p>
                <p><strong>Assessment:</strong> ${assessment}</p>
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
      map.removeOverlay(overlay);
    };
  }, [map, wmsLayer]);

  return null;
};

export default PopupLayer;
