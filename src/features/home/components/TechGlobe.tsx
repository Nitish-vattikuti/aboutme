import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ── Volumetric Cylinder with Hidden-Line Occlusion Mask ── */
const VolumetricCylinder = ({
  from,
  to,
  radius,
  color = "#2d8a6e",
  opacity = 0.22,
  radialSegments = 8,
  heightSegments = 4,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius: number;
  color?: string;
  opacity?: number;
  radialSegments?: number;
  heightSegments?: number;
}) => {
  const { position, quaternion, distance } = useMemo(() => {
    const vStart = new THREE.Vector3(...from);
    const vEnd = new THREE.Vector3(...to);
    const dist = vStart.distanceTo(vEnd);
    const pos = vStart.clone().add(vEnd).multiplyScalar(0.5);

    const direction = vEnd.clone().sub(vStart).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, direction);

    return { position: pos, quaternion: quat, distance: dist };
  }, [from, to]);

  const geom = useMemo(
    () => new THREE.CylinderGeometry(radius, radius, distance, radialSegments, heightSegments),
    [radius, distance, radialSegments, heightSegments]
  );

  return (
    <group position={position} quaternion={quaternion}>
      {/* 1. Depth Mask (prevents internal overlapping lines from rendering) */}
      <mesh geometry={geom} scale={[0.97, 1.0, 0.97]}>
        <meshBasicMaterial colorWrite={false} depthWrite={true} />
      </mesh>
      {/* 2. Wireframe lines */}
      <mesh geometry={geom}>
        <meshBasicMaterial color={color} wireframe opacity={opacity} transparent depthTest={true} />
      </mesh>
    </group>
  );
};

/* ── Volumetric Generic Mesh with Hidden-Line Occlusion Mask ── */
const VolumetricMesh = ({
  geometry,
  position,
  rotation,
  scale = 1.0,
  color = "#2d8a6e",
  opacity = 0.24,
}: {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  opacity?: number;
}) => {
  const scaleVec = useMemo(() => {
    if (Array.isArray(scale)) return new THREE.Vector3(...scale);
    return new THREE.Vector3(scale, scale, scale);
  }, [scale]);

  const innerScaleVec = useMemo(() => {
    return scaleVec.clone().multiplyScalar(0.97); 
  }, [scaleVec]);

  return (
    <group position={position} rotation={rotation}>
      {/* Depth Mask */}
      <mesh geometry={geometry} scale={innerScaleVec}>
        <meshBasicMaterial colorWrite={false} depthWrite={true} />
      </mesh>
      {/* Wireframe */}
      <mesh geometry={geometry} scale={scaleVec}>
        <meshBasicMaterial color={color} wireframe opacity={opacity} transparent depthTest={true} />
      </mesh>
    </group>
  );
};

/* ── Procedural Rounded-Square Dome (DJI Phantom style) ── */
const createRoundedSquareDomeGeometry = (radius: number, height: number, isTop: boolean) => {
  const geom = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const radialSegments = 36;
  const heightSegments = 12;

  for (let i = 0; i <= heightSegments; i++) {
    const v = i / heightSegments;
    const phi = v * (Math.PI / 2); // 0 to pi/2

    const y = isTop ? height * Math.cos(phi) : -height * Math.cos(phi);
    const rBase = radius * Math.sin(phi);

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;

      // Deforms circular sphere into rounded square (corner inflation on diagonals)
      const squareFactor = 1.0 + 0.05 * Math.sin(phi) * -Math.cos(4 * theta);
      const r = rBase * squareFactor;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = i * (radialSegments + 1) + (j + 1);
      const c = (i + 1) * (radialSegments + 1) + j;
      const d = (i + 1) * (radialSegments + 1) + (j + 1);

      if (isTop) {
        indices.push(a, b, d);
        indices.push(a, d, c);
      } else {
        indices.push(a, d, b);
        indices.push(a, c, d);
      }
    }
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
};

/* ── Procedural Rounded-Square Middle Ring ── */
const createRoundedSquareCylinderGeometry = (radius: number, height: number) => {
  const geom = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const radialSegments = 36;
  const heightSegments = 4;

  for (let i = 0; i <= heightSegments; i++) {
    const v = i / heightSegments;
    const y = -height / 2 + v * height;

    for (let j = 0; j <= radialSegments; j++) {
      const u = j / radialSegments;
      const theta = u * Math.PI * 2;

      const squareFactor = 1.0 + 0.05 * -Math.cos(4 * theta);
      const r = radius * squareFactor;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      vertices.push(x, y, z);
    }
  }

  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = i * (radialSegments + 1) + (j + 1);
      const c = (i + 1) * (radialSegments + 1) + j;
      const d = (i + 1) * (radialSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
};

/* ── Procedural Propeller Blade with pitch twist ── */
const createPropellerBladeGeometry = () => {
  const geom = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * 0.38;

    const width = 0.055 * Math.sin(t * Math.PI) * (1.1 - t * 0.35);
    const pitch = 0.15 * (1 - t * 0.85);

    const zFront = width / 2;
    const zBack = -width / 2;

    const yFront = zFront * Math.sin(pitch);
    const yBack = zBack * Math.sin(pitch);

    vertices.push(x, yFront, zFront);
    vertices.push(x, yBack, zBack);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
};

/* ── Dual-Blade Propeller ── */
const Propeller = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  const bladeGeometry = useMemo(() => createPropellerBladeGeometry(), []);
  const domeGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const spindleGeometry = useMemo(() => new THREE.CylinderGeometry(0.035, 0.035, 0.04, 8), []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 24;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Hex spindle nut */}
      <VolumetricMesh geometry={spindleGeometry} position={[0, 0.015, 0]} color="#34d399" opacity={0.4} />
      <VolumetricMesh geometry={domeGeometry} position={[0, 0.03, 0]} color="#34d399" opacity={0.4} />

      {/* Blades */}
      <VolumetricMesh geometry={bladeGeometry} position={[0.03, 0.015, 0]} color="#34d399" opacity={0.35} />
      <VolumetricMesh geometry={bladeGeometry} position={[-0.03, 0.015, 0]} rotation={[0, Math.PI, 0]} color="#34d399" opacity={0.35} />
    </group>
  );
};

/* ── Solid Volumetric DJI Phantom 3D Wireframe Model ── */
const DroneWireframe = () => {
  const topDomeGeom = useMemo(() => createRoundedSquareDomeGeometry(0.34, 0.08, true), []);
  const bodyRingGeom = useMemo(() => createRoundedSquareCylinderGeometry(0.34, 0.2), []);
  const bottomDomeGeom = useMemo(() => createRoundedSquareDomeGeometry(0.38, 0.12, false), []);

  const gpsMastGeom = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 0.12, 6), []);
  const gpsPuckGeom = useMemo(() => new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12, 2), []);
  const gpsDomeGeom = useMemo(() => new THREE.SphereGeometry(0.07, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), []);

  const gimbalCasingGeom = useMemo(() => new THREE.CylinderGeometry(0.11, 0.11, 0.13, 10, 2), []);
  const gimbalLensGeom = useMemo(() => new THREE.CylinderGeometry(0.075, 0.075, 0.04, 10), []);

  const motorCasingGeom = useMemo(() => new THREE.CylinderGeometry(0.14, 0.14, 0.16, 12, 2), []);
  const motorDomeGeom = useMemo(() => new THREE.SphereGeometry(0.14, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const spindleGeom = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6), []);

  const armGeometry = useMemo(() => new THREE.CylinderGeometry(0.07, 0.12, 1.05, 12, 6), []);

  const armAngles = [Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4];

  return (
    <group>
      {/* 1. Volumetric Aerodynamic Fuselage (DJI Phantom style) */}
      <VolumetricMesh geometry={topDomeGeom} position={[0, 0.08, 0]} />
      <VolumetricMesh geometry={bodyRingGeom} position={[0, -0.02, 0]} />
      <VolumetricMesh geometry={bottomDomeGeom} position={[0, -0.12, 0]} />

      {/* 2. Top GPS Mast & Puck */}
      <VolumetricMesh geometry={gpsMastGeom} position={[0, 0.22, -0.18]} />
      <VolumetricMesh geometry={gpsPuckGeom} position={[0, 0.28, -0.18]} />
      <VolumetricMesh geometry={gpsDomeGeom} position={[0, 0.29, -0.18]} />

      {/* 3. Under-Fuselage Camera Gimbal Assembly */}
      {/* Gimbal Vibration Dampers (4 rubber balls) */}
      {[-0.05, 0.05].map((x) =>
        [-0.05, 0.05].map((z) => (
          <mesh key={`damp-${x}-${z}`} position={[x, -0.17, 0.3 + z]} scale={0.016}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#2d8a6e" opacity={0.3} transparent />
          </mesh>
        ))
      )}

      {/* Volumetric mount struts */}
      <VolumetricCylinder from={[0, -0.16, 0.3]} to={[0, -0.28, 0.3]} radius={0.015} />
      <VolumetricCylinder from={[0, -0.28, 0.3]} to={[0, -0.28, 0.38]} radius={0.015} />

      {/* Camera body & lens */}
      <VolumetricMesh geometry={gimbalCasingGeom} position={[0, -0.38, 0.36]} rotation={[0, Math.PI / 2, 0]} />
      <VolumetricMesh geometry={gimbalLensGeom} position={[0, -0.38, 0.435]} rotation={[Math.PI / 2, 0, 0]} />

      {/* 4. Four Volumetric Tapered Diagonal Arms & Motor Assemblies */}
      {armAngles.map((angle, i) => (
        <group key={`arm-${i}`} rotation={[0, angle, 0]}>
          {/* Tapered Circular Arm Cylinder */}
          <VolumetricMesh
            geometry={armGeometry}
            position={[0, 0.02, 0.78]}
            rotation={[Math.PI / 2 - 0.06, 0, 0]}
          />

          {/* Motor Hub Assembly */}
          <group position={[0, 0.08, 1.35]}>
            <VolumetricMesh geometry={motorCasingGeom} />
            <VolumetricMesh geometry={motorDomeGeom} position={[0, 0.08, 0]} />
            <VolumetricMesh geometry={spindleGeom} position={[0, 0.11, 0]} color="#34d399" opacity={0.5} />

            {/* Local Spinning Propeller */}
            <Propeller position={[0, 0.13, 0]} />
          </group>
        </group>
      ))}

      {/* 5. Volumetric Landing Gear Skids (3D tube loops matching DJI Phantom) */}
      {/* Right Side Skid Loop */}
      <VolumetricCylinder from={[0.26, -0.06, 0.22]} to={[0.42, -0.6, 0.4]} radius={0.02} />
      <VolumetricCylinder from={[0.26, -0.06, -0.22]} to={[0.42, -0.6, -0.4]} radius={0.02} />
      <VolumetricCylinder from={[0.42, -0.6, -0.52]} to={[0.42, -0.6, 0.52]} radius={0.025} />
      {/* Skid End Domes */}
      <mesh position={[0.42, -0.6, 0.53]} scale={0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#2d8a6e" opacity={0.3} transparent /></mesh>
      <mesh position={[0.42, -0.6, -0.53]} scale={0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#2d8a6e" opacity={0.3} transparent /></mesh>

      {/* Left Side Skid Loop */}
      <VolumetricCylinder from={[-0.26, -0.06, 0.22]} to={[-0.42, -0.6, 0.4]} radius={0.02} />
      <VolumetricCylinder from={[-0.26, -0.06, -0.22]} to={[-0.42, -0.6, -0.4]} radius={0.02} />
      <VolumetricCylinder from={[-0.42, -0.6, -0.52]} to={[-0.42, -0.6, 0.52]} radius={0.025} />
      {/* Skid End Domes */}
      <mesh position={[-0.42, -0.6, 0.53]} scale={0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#2d8a6e" opacity={0.3} transparent /></mesh>
      <mesh position={[-0.42, -0.6, -0.53]} scale={0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#2d8a6e" opacity={0.3} transparent /></mesh>

      {/* 6. Receiver Antenna Tubes */}
      <VolumetricCylinder from={[0.34, -0.33, 0.08]} to={[0.48, -0.55, -0.15]} radius={0.008} />
      <VolumetricCylinder from={[-0.34, -0.33, 0.08]} to={[-0.48, -0.55, -0.15]} radius={0.008} />
    </group>
  );
};
/* ── Rotating group with slanted angle to showcase 3D depth ── */
const RotatingGroup = ({ children, isDragging }: { children: React.ReactNode; isDragging: boolean }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && !isDragging) {
      ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={ref} rotation={[0.42, 0, 0.12]}>
      {children}
    </group>
  );
};

const DroneScene = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <>
      <ambientLight intensity={0.65} />
      <RotatingGroup isDragging={isDragging}>
        {/* Organic 3D Volumetric Drone Wireframe */}
        <DroneWireframe />
      </RotatingGroup>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} onStart={handleDragStart} onEnd={handleDragEnd} />
    </>
  );
};

const TechGlobe = ({ compact = false }: { compact?: boolean }) => {
  const height = compact ? "400px" : "750px";

  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <Canvas camera={{ position: [0, 0, compact ? 7.2 : 6.2], fov: 42 }}>
        <DroneScene />
      </Canvas>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] text-muted-foreground/45 select-none">
        drag to rotate
      </div>
    </div>
  );
};

export default TechGlobe;
