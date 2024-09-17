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

        // Parse the XML response to find the extent of the specified layer
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
        const layer = xmlDoc.querySelector(`Layer > Name:contains(${layerName})`);

        if (layer) {
          const boundingBox = layer.querySelector('BoundingBox');
          const minX = boundingBox.getAttribute('minx');
          const minY = boundingBox.getAttribute('miny');
          const maxX = boundingBox.getAttribute('maxx');
          const maxY = boundingBox.getAttribute('maxy');

          const extent = [parseFloat(minX), parseFloat(minY), parseFloat(maxX), parseFloat(maxY)];
          if (onExtentReady) onExtentReady(transformExtent(extent, 'EPSG:4326', 'EPSG:3857'));
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
