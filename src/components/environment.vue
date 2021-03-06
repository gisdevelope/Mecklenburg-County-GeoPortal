<template>
    <div>
        <div class="row text-center">
            <div class="column">
                <div v-if="resultsFloodplain">
                    <div class="report-record-highlight">
                        <svg class="icon icon-floodplain"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-floodplain"></use></svg>
                        <h2 v-if="resultsFloodplain.length > 0">This property is in a</h2>
                        <h2 v-else>This property is not in a regulated floodplain.</h2>
                        <h1 v-if="resultsFloodplain.length > 0">REGULATED FLOODPLAIN</h1>
                        <h4 v-if="resultsFloodplain.length > 0"><a target="_blank"  rel="noopener" href={fz}>Special restrictions may apply</a>. For more information, please call 704.336.3728.</h4>
                    </div>
                </div>
            </div>
            <div class="column">
                <div v-if="resultsWaterquality">
                    <div class="report-record-highlight">                        
                        <svg class="icon icon-water-quality"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-water-quality"></use></svg>
                        <div v-if="resultsWaterquality.length > 0">
                            <h2>This property is in a</h2>
                            <h1>WATER QUALITY BUFFER</h1>
                            <h4>The buffer(s) are: <strong>{{ resultsWaterquality | waterquality }}</strong>. <a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank"  rel="noopener">Special restrictions may apply</a>.
                                For more information, please call 980.721.4191 for existing single-family lots and those projects not needing a grading permit or call 704.432.5570 for other projects.</h4>
                        </div>
                        <div v-else>
                            <h2>
                                This property is not in a Water Quality Buffer.</h2>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="text-center row">
            <div class="column">
                <div v-if="resultsPostconstruction">
                    <div class="report-record-highlight">
                        <svg class="icon icon-briefcase"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-briefcase"></use></svg>
                        <div v-if="resultsPostconstruction.length > 0">
                            <h2>This property is in a</h2>
                            <h1>{{ resultsPostconstruction | postconstruction }}</h1>
                            <h4><a href="http://charmeck.org/stormwater/regulations/Pages/Post-ConstructionStormWaterOrdinances.aspx" target="_blank"  rel="noopener">PCCO mitigation options apply</a>. For more information, please call 704.432.5571.</h4>
                        </div>
                        <div v-else>
                            <h2>
                                This property is not in a Distressed Business District or Transit Station Area.</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="report-record-highlight" v-if="resultsWatershed">
                    <svg class="icon icon-watershed"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-watershed"></use></svg>
                    <h2>This property is in the</h2>
                    <h1>{{resultsWatershed[0].name.toUpperCase()}} WATERSHED</h1>
                    <h4>
                        <span style="font-weight: bold;" v-if="resultsWatershed[0].type.length > 1">This is a <a href="http://charlottenc.gov/StormWater/Regulations/Documents/WatershedRulesSummary.pdf" target="_blank"  rel="noopener">{{resultsWatershed[0].type}} watershed ({{resultsWatershed[0].subarea}})</a>.<br></span>
                        A watershed, or drainage basin, is an area of land where all surface water converges to a single point at a lower elevation, usually the exit of the basin such as a river, lake, or wetland.
                    </h4>
                </div>
            </div>
        </div>        
        
        <table v-if="resultsSoil">
            <caption>Soil Types</caption>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Group</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in resultsSoil">
                    <td>
                        {{item.name}}
                    </td>
                    <td>
                        {{item.hydrologic_group}}
                    </td>
                    <td>
                        {{item.description}}
                    </td>
                </tr>
            </tbody>
        </table>
                    
        <div class="report-moreinfo">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/stormwater/Pages/default.aspx" target="_blank"  rel="noopener">Storm Water Services</a></li>
                <li><a href="http://charmeck.org/mecklenburg/county/LUESA/WaterandLandResources/Pages/default.aspx" target="_blank"  rel="noopener">Water &amp; Land Resources</a></li>
                <li><a href="http://charmeck.org/mecklenburg/county/HealthDepartment/EnvironmentalHealth/GWS/Pages/default.aspx" target="_blank"  rel="noopener">Groundwater &amp; Wastewater Services</a></li>
                <li><a href="https://mecklenburgcounty.exavault.com/p/waterquality%252FWQ%2520Buffers/WaterQualityBufferImplementationGuidelines.pdf" target="_blank"  rel="noopener">Water Quality Buffer Implementation Guidelines</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import jsonToURL from "../js/jsontourl";

export default {
  name: "environment",
  data: function() {
    return {
      resultsFloodplain: null,
      resultsSoil: null,
      resultsWaterquality: null,
      resultsPostconstruction: null,
      resultsWatershed: null
    };
  },
  watch: {
    "$parent.sharedState.selected.lnglat": "getResults",
    "$parent.sharedState.show": "getResults"
  },
  filters: {
    postconstruction: function(items) {
      items = items.filter(function(item) {
        return (
          item.type === "TRANSIT CORRIDOR" || item.type === "BUSINESS CORRIDOR"
        );
      });
      items = items.map(function(item) {
        return item.type;
      });
      items = items.join(" and ");
      items = items
        .replace(
          "BUSINESS CORRIDOR",
          "Distressed Business District".toUpperCase()
        )
        .replace("TRANSIT CORRIDOR", "Transit Station Area".toUpperCase());
      return items;
    },
    waterquality: function(items) {
      let typesArr = [];
      for (let i = 0; i < items.length; i++) {
        typesArr.push(`${items[i].label} ${items[i].type}`);
      }
      return typesArr.join(", ");
    }
  },
  mounted: function() {
    this.getResults();
  },
  methods: {
    apiFetch: function(params, url, setter) {
      let _this = this;
      return fetch(`${url}?${jsonToURL(params)}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          _this[setter] = data;
        })
        .catch(function(ex) {
          console.log("parsing failed", ex);
        });
    },
    getResults: function() {
      let _this = this;
      if (
        _this.$parent.sharedState.selected.lnglat &&
        _this.$parent.sharedState.show.indexOf("environment") !== -1
      ) {
        // floodplain
        _this.apiFetch(
          {
            columns: "t.gid",
            filter: `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
            geom_column_from: "the_geom",
            geom_column_to: "the_geom"
          },
          "https://mcmap.org/api/intersect_feature/v1/tax_parcels/view_regulated_floodplains",
          "resultsFloodplain"
        );
        // post construction
        _this.apiFetch(
          {
            columns: "type, name",
            filter: `f.pid = '${
              _this.$parent.sharedState.selected.pid
            }' and t.type in ('TRANSIT CORRIDOR', 'BUSINESS CORRIDOR') `,
            geom_column_from: "the_geom",
            geom_column_to: "the_geom"
          },
          "https://mcmap.org/api/intersect_feature/v1/tax_parcels/post_construction_layers",
          "resultsPostconstruction"
        );
        // soil
        _this.apiFetch(
          {
            columns: "distinct name,description,hydrologic_group",
            filter: `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
            geom_column_from: "the_geom",
            geom_column_to: "the_geom"
          },
          "https://mcmap.org/api/intersect_feature/v1/tax_parcels/soil",
          "resultsSoil"
        );
        // water quality buffers
        _this.apiFetch(
          {
            columns: "distinct type,label",
            filter: `f.pid = '${_this.$parent.sharedState.selected.pid}'`,
            geom_column_from: "the_geom",
            geom_column_to: "the_geom"
          },
          "https://mcmap.org/api/intersect_feature/v1/tax_parcels/water_quality_buffers",
          "resultsWaterquality"
        );
        // watersheds
        _this.apiFetch(
          {
            columns: "name,type,subarea",
            geom_column: "the_geom"
          },
          `https://mcmap.org/api/intersect_point/v1/watersheds/${_this.$parent.sharedState.selected.lnglat.join(
            ","
          )}/4326`,
          "resultsWatershed"
        );
      }
    }
  }
};
</script>