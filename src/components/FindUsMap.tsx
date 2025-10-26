"use client";

type Props = {
  lat?: number;
  lon?: number;
  zoom?: number;
};

export default function FindUsMap({ lat = 42.657222, lon = 21.162222, zoom = 16 }: Props) {
  // small bbox around the point for embedded OSM
  const delta = 0.012;
  const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="mt-6">
      <h5 className="text-sm font-semibold text-gray-200 mb-2">Find Us</h5>
      <div className="w-full rounded-lg overflow-hidden border border-gray-800">
        <iframe
          title="Find Us - National Library of Kosovo"
          src={src}
          style={{ border: 0, width: '100%', height: 220 }}
          loading="lazy"
        />
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Coordinates: 42°39′26″N 21°9′44″E — <a className="underline" href="https://en.wikipedia.org/wiki/National_Library_of_Kosovo#/map/0" target="_blank" rel="noreferrer">Wikipedia map</a>
      </div>
    </div>
  );
}
