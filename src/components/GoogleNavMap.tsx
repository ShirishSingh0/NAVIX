import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps, type LatLng } from '../services/googleMapsService';
import { NavixArrow } from './icons/NavixArrow';

interface GoogleNavMapProps {
  currentLocation: LatLng;
  heading: number;
  overviewPath: LatLng[];
  displaySize: 360 | 412;
  nightMode?: boolean;
}

// Minimalist, high contrast monochrome style custom tailored for the NAVIX Moto HUD
const NAVIX_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0a0d10' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0d10' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#68778d' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8899aa' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1f2834' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#141a22' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2d3a4c' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#19212c' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#242f3d' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#080c10' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3e4d5f' }],
  },
];

export const GoogleNavMap: React.FC<GoogleNavMapProps> = ({
  currentLocation,
  heading,
  overviewPath,
  displaySize,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const glowPolylineRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    loadGoogleMaps().then((gmaps) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = new gmaps.Map(mapContainerRef.current, {
          center: currentLocation,
          zoom: 17,
          disableDefaultUI: true,
          gestureHandling: 'none',
          keyboardShortcuts: false,
          styles: NAVIX_MAP_STYLE,
          backgroundColor: '#0a0d10',
          tilt: 0,
        });

        // Glowing backdrop polyline
        glowPolylineRef.current = new gmaps.Polyline({
          path: overviewPath,
          geodesic: true,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.35,
          strokeWeight: 8,
          map: mapRef.current,
        });

        // Crisp pure-white route line
        polylineRef.current = new gmaps.Polyline({
          path: overviewPath,
          geodesic: true,
          strokeColor: '#FFFFFF',
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map: mapRef.current,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Polyline when overviewPath changes
  useEffect(() => {
    if (polylineRef.current && glowPolylineRef.current) {
      polylineRef.current.setPath(overviewPath);
      glowPolylineRef.current.setPath(overviewPath);
    }
  }, [overviewPath]);

  // Center map on location
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(currentLocation);
    }
  }, [currentLocation]);

  // Handle heading-up rotation around center
  const mapContainerTransform = `rotate(${-heading}deg)`;

  return (
    <div
      style={{
        width: displaySize,
        height: displaySize,
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0d10',
      }}
    >
      {/* 
        Slightly enlarged rotated container so heading rotation never exposes outer corners
      */}
      <div
        style={{
          width: displaySize * 1.5,
          height: displaySize * 1.5,
          position: 'absolute',
          top: -(displaySize * 0.25),
          left: -(displaySize * 0.25),
          transform: mapContainerTransform,
          transformOrigin: 'center center',
          transition: 'transform 0.25s linear',
        }}
      >
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Subtle Circular Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.35) 82%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Arrow Marker fixed at the dead center, heading UP */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <NavixArrow type="position-marker" size={38} />
      </div>
    </div>
  );
};
