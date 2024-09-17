import { useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

const GeoServerLayer = ({ map, visible, layerName }) => {
  useEffect(() => {
    if (!map) return;

    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://13.127.98.21:8080/geoserver/CCMC_DEMO/wms?',
        params: {
          LAYERS: layerName,
          TILED: true,
          FORMAT: 'image/png',
          TRANSPARENT: true,
        },
        serverType: 'geoserver',
        transition: 0,
      }),
      visible: visible,
    });

    map.addLayer(wmsLayer);

    return () => {
      map.removeLayer(wmsLayer); // Clean up the layer when no longer needed
    };
  }, [map, visible, layerName]);

  return null;
};

export default GeoServerLayer;
