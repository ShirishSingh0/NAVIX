import { useState, useEffect, useRef, useCallback } from 'react';
import type { NavState, Waypoint, ScreenType, TrafficLightState, ManoeuvreType } from '../types';
import {
  calculateBearing,
  haversineDistance,
  type GoogleRouteData,
} from '../services/googleMapsService';

// ─── DEFAULT PRESET ROUTE WAYPOINTS (MOCK ROUTE) ─────────────────────────────
export const ROUTE_WAYPOINTS: Waypoint[] = [
  {
    x: 300, y: 1100,
    heading: 0,
    instruction: 'straight',
    distanceToNext: 260,
    streetName: 'Hosur Road',
    nextStreetName: 'Hosur Road',
    speedLimit: 60,
    targetSpeed: 50,
  },
  {
    x: 300, y: 840,
    heading: 0,
    instruction: 'slight-right',
    distanceToNext: 110,
    streetName: 'Hosur Road',
    nextStreetName: 'Church Street',
    speedLimit: 60,
    targetSpeed: 38,
  },
  {
    x: 300, y: 730,
    heading: 90,
    instruction: 'turn-right',
    distanceToNext: 200,
    streetName: 'Church Street',
    nextStreetName: 'Bridge Road',
    speedLimit: 50,
    targetSpeed: 44,
  },
  {
    x: 500, y: 730,
    heading: 90,
    instruction: 'straight',
    distanceToNext: 180,
    streetName: 'Church Street',
    nextStreetName: 'Bridge Road',
    speedLimit: 50,
    targetSpeed: 44,
    landmark: 'bridge',
  },
  {
    x: 680, y: 730,
    heading: 90,
    instruction: 'turn-left',
    distanceToNext: 130,
    streetName: 'Bridge Road',
    nextStreetName: 'Queens Ave',
    speedLimit: 40,
    targetSpeed: 30,
  },
  {
    x: 810, y: 730,
    heading: 0,
    instruction: 'straight',
    distanceToNext: 200,
    streetName: 'Queens Ave',
    nextStreetName: 'Queens Ave',
    speedLimit: 50,
    targetSpeed: 48,
  },
  {
    x: 810, y: 530,
    heading: 0,
    instruction: 'straight',
    distanceToNext: 80,
    streetName: 'Queens Ave',
    nextStreetName: 'Market Cross',
    speedLimit: 50,
    targetSpeed: 20,
    landmark: 'traffic-light',
  },
  {
    x: 810, y: 450,
    heading: 0,
    instruction: 'straight',
    distanceToNext: 0,
    streetName: 'Queens Ave',
    nextStreetName: 'Market Cross',
    speedLimit: 50,
    targetSpeed: 0,
    landmark: 'traffic-light-stop',
  },
  {
    x: 810, y: 450,
    heading: 0,
    instruction: 'slight-left',
    distanceToNext: 150,
    streetName: 'Market Cross',
    nextStreetName: 'Ring Road',
    speedLimit: 50,
    targetSpeed: 40,
  },
  {
    x: 810, y: 300,
    heading: 270,
    instruction: 'turn-left',
    distanceToNext: 200,
    streetName: 'Ring Road',
    nextStreetName: 'Roundabout',
    speedLimit: 60,
    targetSpeed: 50,
  },
  {
    x: 610, y: 300,
    heading: 270,
    instruction: 'roundabout',
    distanceToNext: 120,
    streetName: 'Ring Road',
    nextStreetName: '2nd Exit — Park Road',
    speedLimit: 30,
    targetSpeed: 25,
    landmark: 'roundabout',
  },
  {
    x: 490, y: 300,
    heading: 0,
    instruction: 'straight',
    distanceToNext: 160,
    streetName: 'Park Road',
    nextStreetName: 'Park Road',
    speedLimit: 40,
    targetSpeed: 38,
  },
  {
    x: 490, y: 140,
    heading: 0,
    instruction: 'slight-right',
    distanceToNext: 110,
    streetName: 'Park Road',
    nextStreetName: 'Station Road',
    speedLimit: 40,
    targetSpeed: 36,
  },
  {
    x: 490, y: 60,
    heading: 90,
    instruction: 'turn-right',
    distanceToNext: 150,
    streetName: 'Station Road',
    nextStreetName: 'Destination',
    speedLimit: 30,
    targetSpeed: 25,
  },
  {
    x: 640, y: 60,
    heading: 90,
    instruction: 'straight',
    distanceToNext: 100,
    streetName: 'Station Road',
    nextStreetName: 'Destination',
    speedLimit: 30,
    targetSpeed: 15,
    landmark: 'destination',
  },
  {
    x: 740, y: 60,
    heading: 90,
    instruction: 'straight',
    distanceToNext: 0,
    streetName: 'Station Road',
    nextStreetName: '',
    speedLimit: 30,
    targetSpeed: 0,
  },
];

const TOTAL_ROUTE_METERS = ROUTE_WAYPOINTS.reduce((s, w) => s + w.distanceToNext, 0);

export function useSimulation(
  activeScreen: ScreenType,
  onScreenChange: (screen: ScreenType) => void,
  simSpeed: number = 1
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoSwitchScreens, setAutoSwitchScreens] = useState(true);

  // Google Maps custom route data
  const [googleRoute, setGoogleRoute] = useState<GoogleRouteData | null>(null);

  const [navState, setNavState] = useState<NavState>({
    currentSpeed: 0,
    speedLimit: 60,
    distanceToTurn: 260,
    totalDistanceRemaining: TOTAL_ROUTE_METERS / 1000,
    eta: '12:45',
    currentStreet: '',
    nextStreet: 'Hosur Road',
    heading: 0,
    manoeuvre: 'straight',
    trafficLight: 'red',
    batteryLevel: 80,
    bluetoothConnected: true,
    gpsSignal: true,
    nightMode: false,
    displaySize: 412,
    riderX: ROUTE_WAYPOINTS[0].x,
    riderY: ROUTE_WAYPOINTS[0].y,
    isGoogleRoute: false,
  });

  // Trackers
  const waypointIndexRef = useRef(0);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const trafficLightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedAtTLRef = useRef(false);
  const tlPhaseRef = useRef<'red'|'amber'|'green'>('red');
  const smoothHeadingRef = useRef(0);
  const metersRemainingRef = useRef(TOTAL_ROUTE_METERS);

  // Google Route animation trackers
  const googlePathIndexRef = useRef(0);
  const googleStepIndexRef = useRef(0);
  const googleSubProgressRef = useRef(0);

  const lerpAngle = (a: number, b: number, t: number): number => {
    const diff = ((b - a + 540) % 360) - 180;
    return a + diff * t;
  };

  // Set up custom Google Route
  const loadCustomGoogleRoute = useCallback((routeData: GoogleRouteData) => {
    setIsPlaying(false);
    setGoogleRoute(routeData);

    const firstCoord = routeData.overviewPath[0] || { lat: 12.9716, lng: 77.5946 };
    const secondCoord = routeData.overviewPath[1] || firstCoord;
    const initialHeading = calculateBearing(firstCoord, secondCoord);

    const firstStep = routeData.steps[0];
    const initialDistance = firstStep?.distanceMeters || 100;
    const initialManoeuvre = firstStep?.manoeuvre || 'straight';
    const initialNextStreet = firstStep?.streetName || routeData.summary;

    googlePathIndexRef.current = 0;
    googleStepIndexRef.current = 0;
    googleSubProgressRef.current = 0;
    lastTimeRef.current = 0;
    metersRemainingRef.current = routeData.totalDistanceMeters;
    smoothHeadingRef.current = initialHeading;

    setNavState((prev) => ({
      ...prev,
      isGoogleRoute: true,
      googleLocation: firstCoord,
      googleOverviewPath: routeData.overviewPath,
      currentSpeed: 45,
      speedLimit: 60,
      heading: initialHeading,
      distanceToTurn: initialDistance,
      totalDistanceRemaining: routeData.totalDistanceMeters / 1000,
      eta: formatEta(routeData.totalDistanceMeters, 45),
      currentStreet: '',
      nextStreet: initialNextStreet,
      manoeuvre: initialManoeuvre,
    }));

    onScreenChange('active-nav');
  }, [onScreenChange]);

  // Switch back to preset simulated route
  const loadPresetRoute = useCallback(() => {
    setIsPlaying(false);
    setGoogleRoute(null);
    waypointIndexRef.current = 0;
    progressRef.current = 0;
    lastTimeRef.current = 0;
    stoppedAtTLRef.current = false;
    metersRemainingRef.current = TOTAL_ROUTE_METERS;
    smoothHeadingRef.current = 0;

    setNavState((prev) => ({
      ...prev,
      isGoogleRoute: false,
      currentSpeed: 0,
      speedLimit: 60,
      distanceToTurn: ROUTE_WAYPOINTS[0].distanceToNext,
      totalDistanceRemaining: TOTAL_ROUTE_METERS / 1000,
      eta: '12:45',
      currentStreet: '',
      nextStreet: ROUTE_WAYPOINTS[0].nextStreetName,
      heading: 0,
      manoeuvre: ROUTE_WAYPOINTS[0].instruction,
      trafficLight: 'red',
      riderX: ROUTE_WAYPOINTS[0].x,
      riderY: ROUTE_WAYPOINTS[0].y,
    }));

    onScreenChange('active-nav');
  }, [onScreenChange]);

  // Reset route
  const resetSimulation = useCallback(() => {
    setIsPlaying(false);
    lastTimeRef.current = 0;
    if (trafficLightTimerRef.current) clearTimeout(trafficLightTimerRef.current);

    if (googleRoute) {
      loadCustomGoogleRoute(googleRoute);
    } else {
      loadPresetRoute();
    }
  }, [googleRoute, loadCustomGoogleRoute, loadPresetRoute]);

  const startSimulation = useCallback(() => {
    if (googleRoute) {
      if (googlePathIndexRef.current >= googleRoute.overviewPath.length - 1) {
        googlePathIndexRef.current = 0;
        googleStepIndexRef.current = 0;
        googleSubProgressRef.current = 0;
        metersRemainingRef.current = googleRoute.totalDistanceMeters;
      }
    } else {
      if (waypointIndexRef.current >= ROUTE_WAYPOINTS.length - 1) {
        waypointIndexRef.current = 0;
        progressRef.current = 0;
        metersRemainingRef.current = TOTAL_ROUTE_METERS;
      }
    }
    setIsPlaying(true);
    onScreenChange('active-nav');
  }, [googleRoute, onScreenChange]);

  const pauseSimulation = useCallback(() => setIsPlaying(false), []);

  // Manual setters
  const setSpeed = useCallback((speed: number) =>
    setNavState(prev => ({ ...prev, currentSpeed: Math.max(0, speed) })), []);
  const setSpeedLimit = useCallback((limit: number) =>
    setNavState(prev => ({ ...prev, speedLimit: limit })), []);
  const setDistanceToTurn = useCallback((dist: number) =>
    setNavState(prev => ({ ...prev, distanceToTurn: Math.max(0, dist) })), []);
  const setCurrentStreet = useCallback((street: string) =>
    setNavState(prev => ({ ...prev, currentStreet: street })), []);
  const setNextStreet = useCallback((street: string) =>
    setNavState(prev => ({ ...prev, nextStreet: street })), []);
  const setTrafficLight = useCallback((tl: TrafficLightState) =>
    setNavState(prev => ({ ...prev, trafficLight: tl })), []);
  const setManoeuvre = useCallback((m: ManoeuvreType) =>
    setNavState(prev => ({ ...prev, manoeuvre: m })), []);
  const setDisplaySize = useCallback((size: 360 | 412) =>
    setNavState(prev => ({ ...prev, displaySize: size })), []);
  const setNightMode = useCallback((night: boolean) =>
    setNavState(prev => ({ ...prev, nightMode: night })), []);
  const setBluetoothConnected = useCallback((connected: boolean) =>
    setNavState(prev => ({ ...prev, bluetoothConnected: connected })), []);
  const setGpsSignal = useCallback((gps: boolean) =>
    setNavState(prev => ({ ...prev, gpsSignal: gps })), []);
  const setBatteryLevel = useCallback((level: number) =>
    setNavState(prev => ({ ...prev, batteryLevel: level })), []);

  // Traffic light stop sequence for preset simulation
  const runTrafficLightSequence = useCallback(() => {
    stoppedAtTLRef.current = true;
    tlPhaseRef.current = 'red';
    setNavState(prev => ({ ...prev, currentSpeed: 0, trafficLight: 'red' }));

    trafficLightTimerRef.current = setTimeout(() => {
      tlPhaseRef.current = 'amber';
      setNavState(prev => ({ ...prev, trafficLight: 'amber' }));

      trafficLightTimerRef.current = setTimeout(() => {
        tlPhaseRef.current = 'green';
        setNavState(prev => ({ ...prev, trafficLight: 'green', currentSpeed: 0 }));

        trafficLightTimerRef.current = setTimeout(() => {
          stoppedAtTLRef.current = false;
          if (autoSwitchScreens) onScreenChange('active-nav');
        }, 1500);
      }, 1500);
    }, 5000);
  }, [autoSwitchScreens, onScreenChange]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = timestamp;

      // ────────────────────────────────────────────────────────────────────────
      // MODE A: GOOGLE MAPS ROUTE SIMULATION
      // ────────────────────────────────────────────────────────────────────────
      if (googleRoute) {
        const path = googleRoute.overviewPath;
        const currentPathIdx = googlePathIndexRef.current;

        if (currentPathIdx >= path.length - 1) {
          setIsPlaying(false);
          if (autoSwitchScreens) onScreenChange('dest-reached');
          return;
        }

        const p1 = path[currentPathIdx];
        const p2 = path[currentPathIdx + 1];
        const segmentMeters = haversineDistance(p1, p2);

        // Speed in m/s scaled by simSpeed
        const riderSpeedKmh = 48;
        const speedMps = (riderSpeedKmh / 3.6) * simSpeed;
        const segmentTime = segmentMeters > 0 ? segmentMeters / speedMps : 0.1;
        const progressIncrement = segmentTime > 0 ? dt / segmentTime : 1;

        googleSubProgressRef.current = Math.min(googleSubProgressRef.current + progressIncrement, 1);
        const subP = googleSubProgressRef.current;

        // Interpolated LatLng
        const curLat = p1.lat + (p2.lat - p1.lat) * subP;
        const curLng = p1.lng + (p2.lng - p1.lng) * subP;
        const currentLatLng = { lat: curLat, lng: curLng };

        // Heading
        const targetHeading = calculateBearing(p1, p2);
        smoothHeadingRef.current = lerpAngle(smoothHeadingRef.current, targetHeading, Math.min(subP * 2, 1));

        // Decrease total remaining distance
        const movedMeters = speedMps * dt;
        metersRemainingRef.current = Math.max(0, metersRemainingRef.current - movedMeters);

        // Check current step instruction
        const steps = googleRoute.steps;
        let activeStep = steps[googleStepIndexRef.current] || steps[0];

        // Find distance to next step
        const distToStepEnd = haversineDistance(currentLatLng, activeStep.endLocation);

        if (distToStepEnd < 15 && googleStepIndexRef.current < steps.length - 1) {
          googleStepIndexRef.current += 1;
          activeStep = steps[googleStepIndexRef.current];
        }

        setNavState((prev) => {
          // Truncate overview path to only remaining points ahead
          const remainingPath = [currentLatLng, ...path.slice(currentPathIdx + 1)];
          return {
            ...prev,
            isGoogleRoute: true,
            googleLocation: currentLatLng,
            googleOverviewPath: remainingPath,
            currentSpeed: riderSpeedKmh,
            heading: smoothHeadingRef.current,
            distanceToTurn: Math.max(10, Math.round(distToStepEnd)),
            totalDistanceRemaining: Math.max(0.01, metersRemainingRef.current / 1000),
            manoeuvre: activeStep.manoeuvre,
            nextStreet: activeStep.streetName,
            eta: formatEta(metersRemainingRef.current, riderSpeedKmh),
          };
        });

        if (subP >= 1) {
          googleSubProgressRef.current = 0;
          googlePathIndexRef.current += 1;
        }

        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      // ────────────────────────────────────────────────────────────────────────
      // MODE B: PRESET SVG MAP SIMULATION
      // ────────────────────────────────────────────────────────────────────────
      if (stoppedAtTLRef.current) {
        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      const idx = waypointIndexRef.current;
      if (idx >= ROUTE_WAYPOINTS.length - 1) {
        setIsPlaying(false);
        if (autoSwitchScreens) onScreenChange('dest-reached');
        return;
      }

      const startWp = ROUTE_WAYPOINTS[idx];
      const endWp = ROUTE_WAYPOINTS[idx + 1];

      if (startWp.landmark === 'traffic-light-stop' && !stoppedAtTLRef.current) {
        if (autoSwitchScreens) onScreenChange('traffic-light');
        runTrafficLightSequence();
        waypointIndexRef.current += 1;
        progressRef.current = 0;
        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      if (startWp.distanceToNext === 0) {
        waypointIndexRef.current += 1;
        progressRef.current = 0;
        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      const dx = endWp.x - startWp.x;
      const dy = endWp.y - startWp.y;
      const segLen = Math.hypot(dx, dy);

      const mapUnitsPerSec = (startWp.targetSpeed / 3.6) * 1.0 * simSpeed;
      const stepProgress = segLen > 0 ? (mapUnitsPerSec * dt) / segLen : 1;

      progressRef.current = Math.min(progressRef.current + stepProgress, 1);
      const p = progressRef.current;

      const targetHeading = endWp.heading;
      smoothHeadingRef.current = lerpAngle(smoothHeadingRef.current, targetHeading, Math.min(p * 1.5, 1));

      const riderX = startWp.x + dx * p;
      const riderY = startWp.y + dy * p;
      const remainingInSeg = (1 - p) * startWp.distanceToNext;

      metersRemainingRef.current = Math.max(0, metersRemainingRef.current - mapUnitsPerSec * dt);

      setNavState(prev => ({
        ...prev,
        isGoogleRoute: false,
        riderX,
        riderY,
        currentWaypointIndex: idx,
        heading: smoothHeadingRef.current,
        currentSpeed: startWp.targetSpeed,
        speedLimit: startWp.speedLimit,
        distanceToTurn: Math.round(remainingInSeg),
        totalDistanceRemaining: Math.max(0.01, metersRemainingRef.current / 1000),
        currentStreet: '',
        nextStreet: startWp.nextStreetName,
        manoeuvre: startWp.instruction,
        eta: formatEta(metersRemainingRef.current, startWp.targetSpeed),
      }));

      if (progressRef.current >= 1) {
        progressRef.current = 0;
        const prevIdx = waypointIndexRef.current;
        waypointIndexRef.current += 1;
        const newIdx = waypointIndexRef.current;
        const newWp = ROUTE_WAYPOINTS[newIdx];

        if (newWp && autoSwitchScreens) {
          if (newWp.landmark === 'bridge') {
            onScreenChange('bridge-warning');
            setTimeout(() => { if (autoSwitchScreens) onScreenChange('active-nav'); }, 3000);
          } else if (newWp.landmark === 'roundabout') {
            onScreenChange('roundabout');
          } else if (newWp.landmark === 'destination') {
            onScreenChange('dest-approaching');
          } else if (newWp.landmark !== 'traffic-light-stop' && activeScreen !== 'active-nav') {
            onScreenChange('active-nav');
          }
        }
        if (ROUTE_WAYPOINTS[prevIdx]?.landmark === 'roundabout' && newWp?.landmark !== 'roundabout') {
          if (autoSwitchScreens) onScreenChange('active-nav');
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, autoSwitchScreens, onScreenChange, activeScreen, runTrafficLightSequence, simSpeed, googleRoute]);

  return {
    isPlaying,
    autoSwitchScreens,
    navState,
    googleRoute,
    loadCustomGoogleRoute,
    loadPresetRoute,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setAutoSwitchScreens,
    setSpeed,
    setSpeedLimit,
    setDistanceToTurn,
    setCurrentStreet,
    setNextStreet,
    setTrafficLight,
    setManoeuvre,
    setDisplaySize,
    setNightMode,
    setBluetoothConnected,
    setGpsSignal,
    setBatteryLevel,
  };
}

function formatEta(metersLeft: number, speedKmh: number): string {
  if (speedKmh <= 0) return '--:--';
  const seconds = (metersLeft / 1000) / (speedKmh / 3600);
  const now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
