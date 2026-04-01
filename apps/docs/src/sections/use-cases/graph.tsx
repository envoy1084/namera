import { useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import * as Three from "three";

import { InteractiveNode } from "./node";

type GraphData = {
  linePositions: Float32Array;
  grayPoints: Float32Array;
  blueNodes: { position: [number, number, number]; text: string }[];
};

type NodeGraphProps = {
  count?: number;
  radius?: number;
};

const useCases: string[] = [
  "Trading Agents",
  "DeFi Automation",
  "Subscription Payments",
  "Wallet Delegation",
  "Yield Strategies",
  "Treasury Automation",
  "Agent Workflows",
  "Machine Payments",
  "Micropayments",
  "Onchain Invoicing",
  "Crypto Payroll",
  "Multi-Agent Systems",
  "Streaming Payments",
  "Programmatic Access",
  "Agent Networks",
  "Onchain Automation",
  "Secure Delegation",
  "Escrow Services",
  "Portfolio Rebalancing",
  "Pay-Per-Use APIs",
];

export const NodeGraph = ({ count = 120, radius = 6 }: NodeGraphProps) => {
  const groupRef = useRef<Three.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const currentSpeed = useRef({ x: 0.005, y: 0.01 });

  const { linePositions, grayPoints, blueNodes } = useMemo<GraphData>(() => {
    const lines: number[] = [];
    const grayPositions: number[] = [];
    const bluePositions: {
      position: [number, number, number];
      text: string;
    }[] = [];

    let useCaseIndex = 0;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      lines.push(0, 0, 0, x, y, z);

      if (Math.random() > 0.9 && useCaseIndex < useCases.length) {
        const text = useCases[useCaseIndex] as string;
        bluePositions.push({
          position: [x, y, z],
          text,
        });
        useCaseIndex++;
      } else {
        grayPositions.push(x, y, z);
      }
    }

    return {
      blueNodes: bluePositions,
      grayPoints: new Float32Array(grayPositions),
      linePositions: new Float32Array(lines),
    };
  }, [count, radius]);

  useFrame((_, delta) => {
    const targetX = isHovered ? 0.001 : 0.05;
    const targetY = isHovered ? 0.005 : 0.1;

    currentSpeed.current.x = Three.MathUtils.lerp(
      currentSpeed.current.x,
      targetX,
      delta * 5,
    );
    currentSpeed.current.y = Three.MathUtils.lerp(
      currentSpeed.current.y,
      targetY,
      delta * 5,
    );

    if (groupRef.current) {
      groupRef.current.rotation.x += currentSpeed.current.x * delta;
      groupRef.current.rotation.y += currentSpeed.current.y * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            args={[linePositions, 3]}
            attach="attributes-position"
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c9d3ee" opacity={0.1} transparent={true} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[grayPoints, 3]}
            attach="attributes-position"
            count={grayPoints.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial color="#646e87" size={0.075} sizeAttenuation={true} />
      </points>

      {blueNodes.map((node, i) => (
        <InteractiveNode
          key={i.toString()}
          onHoverChange={setIsHovered}
          position={node.position}
          text={node.text}
        />
      ))}
    </group>
  );
};
