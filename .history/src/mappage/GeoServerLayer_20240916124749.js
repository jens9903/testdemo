import { useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { transformExtent } from 'ol/proj';
import 'ol/ol.css';
import './Map.css';

const GeoServerLayer = ({ map, visible, layerName, onExtentReady }) => {
  useEffect(() => {
    if (!map) return;

    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://13.127.98.21:8080/geoserver/CCMC_DEMO/wms?',
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

    if (visible && onExtentReady) {
      const fetchLayerExtent = async () => {
        const capabilitiesUrl = `http://13.127.98.21:8080/geoserver/CCMC_DEMO/wms?service=WMS&request=GetCapabilities`;
        const response = await fetch(capabilitiesUrl);
        const text = await response.text();

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');

        // Find the layer
        const layers = xmlDoc.getElementsByTagName('Layer');
        let extent = null;

        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          const nameElement = layer.getElementsByTagName('Name')[0];
          const name = nameElement.textContent;

          if (name === layerName) {
            const boundingBox = layer.getElementsByTagName('BoundingBox')[0];
            if (boundingBox) {
              const minX = parseFloat(boundingBox.getAttribute('minx'));
              const minY = parseFloat(boundingBox.getAttribute('miny'));
              const maxX = parseFloat(boundingBox.getAttribute('maxx'));
              const maxY = parseFloat(boundingBox.getAttribute('maxy'));
              extent = [minX, minY, maxX, maxY];
              break;
            }
          }
        }

        if (extent) {
          // Transform extent from EPSG:4326 to EPSG:3857
          const transformedExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
          onExtentReady(transformedExtent);
        }
      };

      fetchLayerExtent();
    }

    return () => {
      map.removeLayer(wmsLayer);
    };
  }, [map, visible, layerName, onExtentReady]);

  return null;
};

export default GeoServerLayer;
