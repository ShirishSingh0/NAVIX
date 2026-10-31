import type { ManoeuvreType } from '../types';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyDDl219E-re0DFma0y-WH6FaMl174QxyK0';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  manoeuvre: ManoeuvreType;
  distanceMeters: number;
  durationSeconds: number;
  streetName: string;
  startLocation: LatLng;
  endLocation: LatLng;
  path: LatLng[];
}

export interface GoogleRouteData {
  summary: string;
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  steps: RouteStep[];
  overviewPath: LatLng[];
  startAddress: string;
  endAddress: string;
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

let googleMapsPromise: Promise<any> | null = null;

// Dynamically load Google Maps JavaScript API via script tag
export function loadGoogleMaps(): Promise<any> {
  const win = window as any;
  if (win.google?.maps) {
    return Promise.resolve(win.google.maps);
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(win.google.maps));
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (win.google?.maps) {
          resolve(win.google.maps);
        } else {
          reject(new Error('Google Maps script loaded, but google.maps was not initialized'));
        }
      };
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

// Places API (New) Autocomplete
export async function fetchPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (!input || input.trim().length < 2) return [];

  const url = 'https://places.googleapis.com/v1/places:autocomplete';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    },
    body: JSON.stringify({
      input: input.trim(),
      languageCode: 'en-US',
    }),
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const suggestions = data?.suggestions || [];

  return suggestions.map((item: any) => {
    const pred = item.placePrediction;
    return {
      placeId: pred?.placeId || pred?.place || '',
      description: pred?.text?.text || '',
      mainText: pred?.structuredFormat?.mainText?.text || pred?.text?.text || '',
      secondaryText: pred?.structuredFormat?.secondaryText?.text || '',
    };
  });
}

// Polyline decoder: decodes Google encodedPolyline strings into LatLng array
export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

// Convert Google Routes API maneuver string or text to NAVIX ManoeuvreType
export function mapGoogleManoeuvre(maneuver?: string, instructionHtml?: string): ManoeuvreType {
  const m = (maneuver || '').toUpperCase();
  const text = (instructionHtml || '').toLowerCase();

  if (m.includes('ROUNDABOUT') || text.includes('roundabout') || text.includes('rotary')) {
    return 'roundabout';
  }
  if (m.includes('U_TURN') || text.includes('u-turn') || text.includes('make a u-turn')) {
    return 'u-turn';
  }
  if (m.includes('SLIGHT_RIGHT') || text.includes('slight right') || text.includes('bear right')) {
    return 'slight-right';
  }
  if (m.includes('SLIGHT_LEFT') || text.includes('slight left') || text.includes('bear left')) {
    return 'slight-left';
  }
  if (m.includes('RIGHT') || text.includes('turn right') || text.includes('keep right')) {
    return 'turn-right';
  }
  if (m.includes('LEFT') || text.includes('turn left') || text.includes('keep left')) {
    return 'turn-left';
  }
  return 'straight';
}

// Parse duration string from Routes API like "1087s" into seconds number
function parseDuration(durationStr?: string): number {
  if (!durationStr) return 0;
  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Clean street name from instructions
export function extractStreetName(instruction?: string): string {
  if (!instruction) return 'Road';

  const lines = instruction.split('\n');
  let firstLine = lines[0].replace(/<[^>]*>/g, '').trim();

  const prefixes = [
    /^Head\s+(north|south|east|west|northeast|northwest|southeast|southwest)\s+on\s+/i,
    /^Turn\s+(right|left|slight right|slight left|sharp right|sharp left)\s+onto\s+/i,
    /^Continue\s+(to\s+follow|onto)\s+/i,
    /^Keep\s+(right|left)\s+(onto|to stay on|to take the flyover|to take)\s+/i,
    /^Take\s+the\s+/i,
  ];

  for (const p of prefixes) {
    if (p.test(firstLine)) {
      firstLine = firstLine.replace(p, '');
      break;
    }
  }

  firstLine = firstLine.replace(/\s+toward\s+.*$/i, '');
  firstLine = firstLine.replace(/\s+Pass by\s+.*$/i, '');

  return firstLine.trim() || 'Road';
}

// Fetch Directions using Google Routes API
export async function calculateGoogleRoute(
  origin: string,
  destination: string
): Promise<GoogleRouteData> {
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const body = {
    origin: { address: origin },
    destination: { address: destination },
    travelMode: 'TWO_WHEELER', // Motorcycle / Scooter / Two-Wheeler routing
    languageCode: 'en-US',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask':
        'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps.navigationInstruction,routes.legs.steps.distanceMeters,routes.legs.steps.staticDuration,routes.legs.steps.polyline.encodedPolyline,routes.legs.steps.startLocation,routes.legs.steps.endLocation',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    const msg = errorJson?.error?.message || `HTTP error ${response.status}`;
    throw new Error(msg);
  }

  const result = await response.json();
  const route = result?.routes?.[0];

  if (!route) {
    throw new Error('No route found between the specified locations');
  }

  const overviewPath = route.polyline?.encodedPolyline
    ? decodePolyline(route.polyline.encodedPolyline)
    : [];

  const totalDistanceMeters = route.distanceMeters || 0;
  const totalDurationSeconds = parseDuration(route.duration);

  const leg = route.legs?.[0];
  const rawSteps = leg?.steps || [];

  const steps: RouteStep[] = rawSteps.map((step: any) => {
    const stepPolyline = step.polyline?.encodedPolyline
      ? decodePolyline(step.polyline.encodedPolyline)
      : [];

    const navInstr = step.navigationInstruction;
    const manoeuvre = mapGoogleManoeuvre(navInstr?.maneuver, navInstr?.instructions);
    const instruction = navInstr?.instructions || 'Continue straight';
    const streetName = extractStreetName(instruction);

    const startLoc: LatLng = step.startLocation?.latLng
      ? { lat: step.startLocation.latLng.latitude, lng: step.startLocation.latLng.longitude }
      : stepPolyline[0] || overviewPath[0] || { lat: 0, lng: 0 };

    const endLoc: LatLng = step.endLocation?.latLng
      ? { lat: step.endLocation.latLng.latitude, lng: step.endLocation.latLng.longitude }
      : stepPolyline[stepPolyline.length - 1] || overviewPath[overviewPath.length - 1] || { lat: 0, lng: 0 };

    return {
      instruction,
      manoeuvre,
      distanceMeters: step.distanceMeters || 0,
      durationSeconds: parseDuration(step.staticDuration),
      streetName,
      startLocation: startLoc,
      endLocation: endLoc,
      path: stepPolyline,
    };
  });

  return {
    summary: `${origin} → ${destination}`,
    totalDistanceMeters,
    totalDurationSeconds,
    steps,
    overviewPath,
    startAddress: origin,
    endAddress: destination,
  };
}

// Compute bearing (heading) between two coordinates in degrees (0 = North)
export function calculateBearing(
  from: LatLng,
  to: LatLng
): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lon1 = (from.lng * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lon2 = (to.lng * Math.PI) / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  const theta = Math.atan2(y, x);
  const bearing = (theta * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Distance between two points in meters (Haversine formula)
export function haversineDistance(
  p1: LatLng,
  p2: LatLng
): number {
  const R = 6371e3;
  const phi1 = (p1.lat * Math.PI) / 180;
  const phi2 = (p2.lat * Math.PI) / 180;
  const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
  const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
