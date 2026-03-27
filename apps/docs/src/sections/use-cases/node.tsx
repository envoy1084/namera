import { useState } from "react";

import { Billboard, Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as Three from "three";

type InteractiveNodeProps = {
  position: [number, number, number];
  text: string;
  onHoverChange: (isHovered: boolean) => void;
};

export const InteractiveNode = ({
  position,
  text,
  onHoverChange,
}: InteractiveNodeProps) => {
  const [hovered, setHover] = useState(false);

  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
      position={position}
    >
      <mesh
        onPointerOut={() => {
          setHover(false);
          onHoverChange(false);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHover(true);
          onHoverChange(true);
        }}
      >
        <planeGeometry args={[0.2, 0.2]} />
        <meshBasicMaterial
          color={hovered ? "#c9d3ee" : "#707fdb"}
          opacity={0.9}
          side={Three.DoubleSide}
          transparent={true}
        />

        {hovered && (
          <Html
            center={true}
            className="pointer-events-none"
            distanceFactor={undefined}
            zIndexRange={[100, 0]}
          >
            <div className="whitespace-nowrap rounded px-3 py-1.5 text-sm tracking-widest text-primary shadow-lg drop-shadow-md backdrop-blur-sm transform -translate-y-full translate-x-[50%]">
              {text}
            </div>
          </Html>
        )}
      </mesh>
    </Billboard>
  );
};
