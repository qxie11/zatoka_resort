"use client";

import { useState, useCallback, useRef } from "react";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 46.13355,
  lng: 30.51818,
};

// Custom dark map styling matching the premium dark theme of Zatoka Resort
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2dd4bf" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#0ea5e9" }],
  },
];

interface Attraction {
  id: string;
  name: { ru: string; uk: string; en: string };
  desc: { ru: string; uk: string; en: string };
  lat: number;
  lng: number;
  distance: { ru: string; uk: string; en: string };
}

const ATTRACTIONS: Attraction[] = [
  {
    id: "hotel",
    name: { ru: "Zatoka Resort (Отель)", uk: "Zatoka Resort (Готель)", en: "Zatoka Resort (Hotel)" },
    desc: { ru: "Наш отель — отправная точка вашего отдыха у моря.", uk: "Наш готель — стартова точка вашого відпочинку біля моря.", en: "Our hotel — the starting point of your seaside vacation." },
    lat: 46.13355,
    lng: 30.51818,
    distance: { ru: "0 км", uk: "0 км", en: "0 km" }
  },
  {
    id: "beach",
    name: { ru: "Центральный пляж Затоки", uk: "Центральний пляж Затоки", en: "Zatoka Central Beach" },
    desc: { ru: "Широкий песчаный пляж с пологим входом в Черное море, шезлонгами и развлечениями.", uk: "Широкий піщаний пляж з пологим входом у Чорне море, шезлонгами та розвагами.", en: "Wide sandy beach with a shallow entrance to the Black Sea, sunbeds, and activities." },
    lat: 46.1565,
    lng: 30.5460,
    distance: { ru: "400 м (5 мин пешком)", uk: "400 м (5 хв пішки)", en: "400 m (5 min walk)" }
  },
  {
    id: "liman",
    name: { ru: "Днестровский лиман", uk: "Дністровський лиман", en: "Dniester Estuary" },
    desc: { ru: "Прекрасное место для прогулок на лодках, каяках, сапбордах и рыбалки в тихой пресной воде.", uk: "Прекрасне місце для прогулянок на човнах, каяках, сапбордах та риболовлі у тихій прісній воді.", en: "A great place for boating, kayaking, paddleboarding, and fishing in calm freshwater." },
    lat: 46.1750,
    lng: 30.5100,
    distance: { ru: "3 км", uk: "3 км", en: "3 km" }
  },
  {
    id: "shabo",
    name: { ru: "Центр культуры вина Shabo", uk: "Центр культури вина Shabo", en: "Shabo Wine Center" },
    desc: { ru: "Знаменитый центр культуры вина с дегустациями, экскурсиями по старинным погребам и современным арт-объектам.", uk: "Знаменитий центр культури вина з дегустаціями, екскурсіями по старовинних підвалах та сучасних арт-об'єктах.", en: "Famous wine culture center offering wine tastings, tours of historic cellars, and modern art exhibitions." },
    lat: 46.133333,
    lng: 30.383333,
    distance: { ru: "16 км", uk: "16 км", en: "16 km" }
  },
  {
    id: "akkerman",
    name: { ru: "Аккерманская крепость", uk: "Аккерманська фортеця", en: "Akkerman Fortress" },
    desc: { ru: "Крупнейшая средневековая крепость Украины на берегу Днестровского лимана, построенная в XIII-XV веках.", uk: "Найбільша середньовічна фортеця України на березі Дністровського лиману, побудована у XIII-XV століттях.", en: "The largest medieval fortress in Ukraine, situated on the shores of the Dniester Estuary, built in 13th-15th centuries." },
    lat: 46.2012,
    lng: 30.3503,
    distance: { ru: "20 км", uk: "20 км", en: "20 km" }
  }
];

interface GoogleMapComponentProps {
  showAttractions?: boolean;
  lang?: string;
}

export default function GoogleMapComponent({ showAttractions = false, lang = "ru" }: GoogleMapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeAttraction, setActiveAttraction] = useState<Attraction | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSelect = (att: Attraction) => {
    setActiveAttraction(att);
    if (map) {
      map.panTo({ lat: att.lat, lng: att.lng });
      map.setZoom(att.id === "hotel" || att.id === "beach" ? 15 : 12);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[350px] bg-slate-900/40 animate-pulse flex items-center justify-center text-slate-400 text-sm rounded-3xl border border-white/5">
        {lang === "uk" ? "Завантаження карти..." : lang === "en" ? "Loading map..." : "Загрузка карты..."}
      </div>
    );
  }

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {/* Hotel Marker */}
      {!showAttractions ? (
        <Marker
          position={center}
          title="Затока Resort"
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "#2dd4bf",
            fillOpacity: 1,
            strokeColor: "#020617",
            strokeWeight: 2,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 22),
          }}
        />
      ) : (
        <>
          {ATTRACTIONS.map((att) => (
            <Marker
              key={att.id}
              position={{ lat: att.lat, lng: att.lng }}
              title={att.name[lang as "ru" | "uk" | "en"]}
              onClick={() => handleSelect(att)}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: att.id === "hotel" ? "#f59e0b" : "#2dd4bf", // Gold for hotel, teal for attractions
                fillOpacity: 1,
                strokeColor: "#020617",
                strokeWeight: 2,
                scale: att.id === "hotel" ? 1.7 : 1.3,
                anchor: new window.google.maps.Point(12, 22),
              }}
            />
          ))}

          {activeAttraction && (
            <InfoWindow
              position={{ lat: activeAttraction.lat, lng: activeAttraction.lng }}
              onCloseClick={() => setActiveAttraction(null)}
            >
              <div className="p-2 text-slate-900 max-w-xs font-sans">
                <h4 className="font-extrabold text-sm text-slate-950 mb-1">{activeAttraction.name[lang as "ru" | "uk" | "en"]}</h4>
                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{activeAttraction.desc[lang as "ru" | "uk" | "en"]}</p>
                <div className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded inline-block">
                  {lang === "uk" ? "Відстань від готелю: " : lang === "en" ? "Distance: " : "Расстояние от отеля: "}
                  {activeAttraction.distance[lang as "ru" | "uk" | "en"]}
                </div>
              </div>
            </InfoWindow>
          )}
        </>
      )}
    </GoogleMap>
  );

  if (showAttractions) {
    return (
      <div className="flex flex-col lg:flex-row w-full h-[550px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/20 backdrop-blur-md">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-slate-950/80 border-b lg:border-b-0 lg:border-r border-white/10 p-5 overflow-y-auto flex flex-col gap-3 shrink-0">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-teal-400 mb-2">
            {lang === "uk" ? "Що відвідати поруч" : lang === "en" ? "Attractions Nearby" : "Что посетить рядом"}
          </h3>
          {ATTRACTIONS.map((att) => (
            <button
              key={att.id}
              onClick={() => handleSelect(att)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-300 ${
                activeAttraction?.id === att.id
                  ? "bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                  : "bg-slate-900/40 border-white/5 hover:border-white/15 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-bold text-sm text-white leading-snug">{att.name[lang as "ru" | "uk" | "en"]}</span>
                <span className="text-[10px] font-mono bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded shrink-0">
                  {att.distance[lang as "ru" | "uk" | "en"]}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light line-clamp-2 leading-relaxed">
                {att.desc[lang as "ru" | "uk" | "en"]}
              </p>
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="flex-1 relative h-[300px] lg:h-full">
          {renderMap()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px]">
      {renderMap()}
    </div>
  );
}
