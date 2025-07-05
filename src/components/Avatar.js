'use client';

import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Avatar({ isSpeaking, animationName = 'Idle', position, scale }) {
  const group = useRef(null);
  const { scene, animations } = useGLTF('/models/human.glb');
  const { actions } = useAnimations(animations, group);

  const headMesh = useRef(null);
  const morphIndexRef = useRef({
    mouthOpen: null,
    blinkL: null,
    blinkR: null,
  });

  const timeRef = useRef(0);
  const visemeTimer = useRef(0);
  const currentIntensity = useRef(0);
  const blinkTimer = useRef(Math.random() * 4 + 2);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes('head')) {
        const mesh = child;
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          headMesh.current = mesh;
          const dict = mesh.morphTargetDictionary;
          morphIndexRef.current = {
            mouthOpen: dict.mouthOpen ?? dict.jawOpen ?? null,
            blinkL: dict.eyeBlinkLeft ?? null,
            blinkR: dict.eyeBlinkRight ?? null,
          };
        }
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    const head = headMesh.current;
    const morphs = morphIndexRef.current;
    if (!head || morphs.mouthOpen == null) return;

    // Lip-sync
    if (isSpeaking) {
      timeRef.current += delta;
      visemeTimer.current -= delta;
      if (visemeTimer.current <= 0) {
        currentIntensity.current = Math.random() * 0.7 + 0.3;
        visemeTimer.current = Math.random() * 0.1 + 0.08;
      }
      const prev = head.morphTargetInfluences[morphs.mouthOpen] || 0;
      head.morphTargetInfluences[morphs.mouthOpen] = THREE.MathUtils.lerp(prev, currentIntensity.current, 0.3);
    } else {
      head.morphTargetInfluences[morphs.mouthOpen] = 0;
    }

    // Blinking
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0 && morphs.blinkL != null && morphs.blinkR != null) {
      head.morphTargetInfluences[morphs.blinkL] = 1;
      head.morphTargetInfluences[morphs.blinkR] = 1;
      setTimeout(() => {
        if (head.morphTargetInfluences) {
          head.morphTargetInfluences[morphs.blinkL] = 0;
          head.morphTargetInfluences[morphs.blinkR] = 0;
        }
      }, 120);
      blinkTimer.current = Math.random() * 4 + 2;
    }

    // Gentle head sway
    if (group.current) {
      group.current.rotation.y = Math.sin(Date.now() * 0.0015) * 0.04;
      group.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  // Reset mouth morph when not speaking
  useEffect(() => {
    if (!isSpeaking && headMesh.current && morphIndexRef.current.mouthOpen != null) {
      headMesh.current.morphTargetInfluences[morphIndexRef.current.mouthOpen] = 0;
    }
  }, [isSpeaking]);

  // Trigger animation
  useEffect(() => {
    if (actions && actions[animationName]) {
      Object.values(actions).forEach((a) => a?.stop());
      actions[animationName]?.play();
    }
  }, [animationName, actions]);

  return (
    <group ref={group} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
