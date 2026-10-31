export type ScreenType =
  | 'startup'
  | 'connected'
  | 'active-nav'
  | 'turn-emphasis'
  | 'bridge-warning'
  | 'roundabout'
  | 'traffic-light'
  | 'dest-approaching'
  | 'dest-reached'
  | 'rerouting'
  | 'bluetooth-disconnected'
  | 'gps-lost'
  | 'low-battery'
  | 'night-mode';

export type ManoeuvreType =
  | 'straight'
  | 'turn-right'
  | 'turn-left'
  | 'slight-right'
  | 'slight-left'
  | 'u-turn'
  | 'roundabout';

export type TrafficLightState = 'red' | 'amber' | 'green';

export interface Waypoint {
  x: number;
  y: number;
  heading: number; // degrees (0 = north/up, 90 = east, etc.)
  instruction: ManoeuvreType;
  distanceToNext: number; // meters
  streetName: string;
  nextStreetName: string;
  speedLimit: number;
  targetSpeed: number;
  landmark?: 'bridge' | 'roundabout' | 'traffic-light' | 'traffic-light-stop' | 'destination';
}

export interface NavState {
  currentSpeed: number;
  speedLimit: number;
  distanceToTurn: number;
  totalDistanceRemaining: number;
  eta: string;
  currentStreet: string;
  nextStreet: string;
  heading: number;
  manoeuvre: ManoeuvreType;
  trafficLight: TrafficLightState;
  batteryLevel: number;
  bluetoothConnected: boolean;
  gpsSignal: boolean;
  nightMode: boolean;
  displaySize: 360 | 412;
  riderX: number;
  riderY: number;
  // Google Maps real route tracking
  isGoogleRoute?: boolean;
  googleLocation?: { lat: number; lng: number };
  googleOverviewPath?: { lat: number; lng: number }[];
  currentWaypointIndex?: number;
}
