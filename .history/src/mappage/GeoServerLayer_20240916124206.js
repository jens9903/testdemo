import { useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

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

    // Fetch extent from GetCapabilities
    const fetchLayerExtent = async () => {
      const capabilitiesUrl = `http://13.127.98.21:8080/geoserver/CCMC_DEMO/wms?service=WMS&version=1.1.1&request=GetCapabilities`;

      try {
        const response = await fetch(capabilitiesUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const layerElement = xml.querySelector(`Layer[Name="${layerName}"] > LatLonBoundingBox`);

        if (layerElement) {
          const minx = parseFloat(layerElement.getAttribute('minx'));
          const miny = parseFloat(layerElement.getAttribute('miny'));
          const maxx = parseFloat(layerElement.getAttribute('maxx'));
          const maxy = parseFloat(layerElement.getAttribute('maxy'));
          const extent = [minx, miny, maxx, maxy];

          if (onExtentReady) {
            onExtentReady(extent);
          }
        }
      } catch (error) {
        console.error("Error fetching layer extent:", error);
      }
    };

    if (visible) {
      fetchLayerExtent();
    }

    return () => {
      map.removeLayer(wmsLayer);
    };
  }, [map, visible, layerName, onExtentReady]);

  return null;
};

export default GeoServerLayer;
