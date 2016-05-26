define(["flight/component", "vendor/gmap", "vendor/markerclusterer", "view/mapfloater", "utils/channels", "utils/findElements"],
    function (defineComponent, gmap, MarkerClusterer, createFloaterView, channels, findElements) {
    "use strict";

    var
    that,
    $that,
    selectors = {
        canvas: "#map-canvas"
    },
    mapOptions = {
        center: new gmap.LatLng(0,0),
        zoom: 3,
        minZoom: 3,
        maxZoom: 18,
        scrollwheel: false,
        mapTypeId: gmap.MapTypeId.ROADMAP
    },
    map,
    floaterView,
    populateMarkers = function (markers) {
        var
        index = null,
        marker = null,
        obj = null,
        markerList = [],
        clusterStyles = [],
        i = 0;

        for (i; i < 3; i += 1) {
            clusterStyles.push({
                textColor: "#FFF",
                url: "/static/images/GoogleMapsCluster.png",
                height: 44,
                width: 44,
                fontFamily: "petala-pro, sans-serif",
                textSize: 13,
                backgroundPosition: "0 1px"
            });
        }

        for (index in markers) {
            if (markers.hasOwnProperty(index)) {
                obj = markers[index];
                marker = new gmap.Marker({
                    position: new gmap.LatLng(obj.location.latitude, obj.location.longitude),
                    map: map,
                    pagePath: obj.pagePath,
                    icon: "/static/images/GoogleMapsMarker.png"
                });
                markerList.push(marker);
                createEventListenerForMarker(marker);
            }
        }
        new MarkerClusterer(map, markerList, {styles: clusterStyles});
    },
    createEventListenerForMarker = function (marker) {
        gmap.event.addListener(marker, "click", function () {
            // Centraliza o mapa para uma melhor usabilidade
            window.setTimeout(function () {
                map.panTo(marker.getPosition());
            }, 500);

            that.trigger(document, channels.loadMarkerInfo, {marker: marker});
        });
    },
    createEventListenerForStreetView = function () {
        // Hide the MarkerInfo when StreetView is active
        gmap.event.addListener(map.getStreetView(), "visible_changed", function () {
            if (this.getVisible()) {
                floaterView.hide();
            }
        });
    },
    displayInfo = function (markerInfo) {
        floaterView.render(markerInfo);
        floaterView.show();
    };

    return defineComponent(function () {
        this.after("initialize", function () {
            that = this;
            $that = that.$node;
            findElements(that, selectors);
            // 1) Inicializa o Google Maps
            map = new gmap.Map(that.elements.canvas.get(0), mapOptions);
            createEventListenerForStreetView();

            floaterView = createFloaterView(that);

            that.trigger(document, channels.loadMarkers);
            that.on(document, channels.loadMarkersFinished, function (event, result) {
                populateMarkers(result.data);
            });
            that.on(document, channels.loadMarkerInfoFinished, function (event, result) {
                displayInfo(result.data);
            });
        });
    });
});