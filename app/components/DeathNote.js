import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function DeathNote(props) {
  const { nodes, materials } = useGLTF("/models/death_note.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube_DEATH_NOTE_0.geometry}
        material={materials.DEATH_NOTE}
        position={[0, 0, 0]}
        rotation={[Math.PI, 0, 0]}
        scale={1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_PAPERS_0.geometry}
        material={materials.PAPERS}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        scale={[2, 1, 1]}
      />
    </group>
  );
}

useGLTF.preload("/models/death_note.glb");
