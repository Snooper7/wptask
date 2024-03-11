const YaMaps = {
    init() {
        document.querySelectorAll("[data-map]").forEach((el) => {
            try {
                const points = JSON.parse(el.dataset.map);
                points && this.mapInit(el, points);
            } catch (e) {
                alert("Яндекс карты: некорректный json в data-map");
            }
        });
    },

    loadScript() {
        if (!this.scriptLoaded) {
            this.scriptLoaded = true;
            let s = document.createElement("script");
            s.setAttribute(
                "src",
                "//api-maps.yandex.ru/2.1/?lang=ru_RU&onload=yaMapsOnLoad"
            );
            document.body.appendChild(s);
        }
    },

    mapInit(el, points) {
        let iconImgSize = [26, 30];
        let iconImgOffset = [-25, -25];
        let zoomMap = 15;
        let offsetTop = 0;
        if (window.matchMedia("(max-width: 575px)").matches) {
            zoomMap = 15;
        }


        this.loadScript();
        el.classList.add("is-loading");
        document.addEventListener("ya-maps:load", () => {
            const clusterer = new ymaps.Clusterer();
            const myGeoObjects = [];
            const myMap = new ymaps.Map(el, {
                center: points[0].coords.split(","),
                zoom: zoomMap,
                controls: ["zoomControl"],
            });

        for (let i of points) {
            myGeoObjects.push(
                new ymaps.GeoObject(
                    {
                        geometry: { type: "Point", coordinates: i.coords.split(",") },
                        },
                    {
                        iconImageHref: assets + '/images/icons/mapPoint.svg',
                        iconLayout: "default#image",
                        iconImageSize: iconImgSize,
                        iconImageOffset: iconImgOffset,
                        }
                )
            );
        }

            clusterer.add(myGeoObjects);
            myMap.geoObjects.add(clusterer);

            // if ("ontouchstart" in document.documentElement) {
            //     myMap.behaviors.disable("drag");
            // }

            let position = myMap.getGlobalPixelCenter();
            myMap.setGlobalPixelCenter([
                position[0],
                position[1] - offsetTop,
            ]);

            el.classList.remove("is-loading");
        });
    },
};

window.yaMapsOnLoad = () => {
    document.dispatchEvent(new CustomEvent("ya-maps:load"));
}

export default YaMaps;

YaMaps.init();