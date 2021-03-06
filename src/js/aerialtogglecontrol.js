export default class AerialToggle {
  constructor({ placeUnder = "water_name_line" }) {
    this._placeUnder = placeUnder;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-aerial";
    this._btn.type = "button";
    this._btn.setAttribute("aria-label", "toggle satellite imagery");
    this._btn.onclick = function() {
      if (map.getLayer("satellite")) {
        map.removeLayer("satellite");
        map.removeSource("satellite");
        _this._btn.classList.remove("mapboxgl-ctrl-aerial-active");
      } else {
        map.addLayer(
          {
            id: "satellite",
            type: "raster",
            source: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              ],
              tileSize: 256,
              maxzoom: 19
            },
            minzoom: 0,
            maxzoom: 22
          },
          _this._placeUnder
        );
        _this._btn.classList.add("mapboxgl-ctrl-aerial-active");
      }
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
