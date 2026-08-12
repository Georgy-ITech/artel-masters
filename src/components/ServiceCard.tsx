"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { paperTexture, textureLoader } from "@/lib/textures";

/* Карточка выше кадра ровно настолько, чтобы поле снизу вышло втрое шире
   боковых, а окно осталось в родной пропорции снимка 3:4:
   поле 0.09 → окно 1.32 × 1.76, снизу 0.27. */
export const CARD_W = 1.5;
export const CARD_H = 2.12;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Карточка — отпечаток, наклеенный на бумажное поле: снаружи настоящая
   фотография бумаги, внутри окно с кадром. Кадр приглушён и набирает цвет,
   когда на него наводят. */
const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uPaper;
  uniform float uHover;
  uniform float uDim;
  uniform float uReveal;
  uniform float uAspect;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    // окно с кадром: снизу поле шире, как у наклеенного отпечатка.
    // Пропорция окна равна пропорции снимка, поэтому кадр не растягивается.
    vec2 win0 = vec2(0.0600, 0.1275);
    vec2 win1 = vec2(0.9400, 0.9575);
    vec2 t = (vUv - win0) / (win1 - win0);
    float inWin =
      step(0.0, t.x) * step(t.x, 1.0) * step(0.0, t.y) * step(t.y, 1.0);

    vec3 col;

    if (inWin > 0.5) {
      vec4 shot = texture2D(uMap, t);
      float luma = dot(shot.rgb, vec3(0.299, 0.587, 0.114));
      vec3 quiet = vec3(luma) * vec3(1.04, 0.97, 0.88);
      col = mix(quiet * 0.92, shot.rgb, uHover);
      float d = distance(t, vec2(0.5));
      col *= 1.0 - smoothstep(0.44, 0.98, d) * 0.3;
    } else {
      // бумагу сэмплим только там, где она видна, — это поле вокруг кадра
      vec3 paperTex = texture2D(uPaper, vUv * vec2(0.62, 0.46) + uSeed).rgb;
      float grain = dot(paperTex, vec3(0.333));
      col = vec3(0.90, 0.86, 0.78) * (0.62 + 0.62 * grain);

      // тень от края отпечатка: под курсором он приподнят, тень уходит дальше
      vec2 e = max(win0 - vUv, vUv - win1);
      float away = max(e.x, e.y);
      float reach = mix(0.030, 0.055, uHover);
      col *= 1.0 - smoothstep(reach, 0.0, away) * mix(0.30, 0.46, uHover);
    }

    col *= uDim;

    // скруглённый прямоугольник в пропорции карточки
    vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
    float r = 0.05;
    vec2 halfBox = vec2(uAspect, 1.0) - r;
    vec2 q = abs(pos) - halfBox;
    float sdf = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    float alpha = 1.0 - smoothstep(0.0, 0.012, sdf);

    gl_FragColor = vec4(col, alpha * uReveal);
  }
`;

export type ServiceCardProps = {
  src: string;
  active: boolean;
  depth: number;
  startAt: number | null;
  delay: number;
  seed: number;
  position: [number, number, number];
  rotationY: number;
  onOver: () => void;
  onOut: () => void;
  onSelect: () => void;
};

export function ServiceCard({
  src,
  active,
  depth,
  startAt,
  delay,
  seed,
  position,
  rotationY,
  onOver,
  onOut,
  onSelect,
}: ServiceCardProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const probe = useMemo(() => new THREE.Vector3(), []);
  const lift = useRef(0);
  const { camera } = useThree();

  const texture = useMemo(() => {
    const t = textureLoader.load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [src]);

  useEffect(() => () => texture.dispose(), [texture]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: texture },
      uPaper: { value: paperTexture() },
      uHover: { value: 0 },
      uDim: { value: 1 },
      uReveal: { value: 0 },
      uAspect: { value: CARD_W / CARD_H },
      uSeed: { value: seed },
    }),
    [texture, seed],
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const k = 1 - Math.pow(0.0015, d);

    let reveal = 0;
    if (startAt !== null) {
      const t = (performance.now() - startAt) / 1000 - delay;
      const p = Math.min(Math.max(t / 0.9, 0), 1);
      reveal = 1 - Math.pow(1 - p, 3);
    }

    const g = group.current;
    const m = material.current;

    // у края кадра карточка растворяется, а не обрезается рамкой окна
    let edge = 1;
    if (g) {
      probe.set(0, 0, 0).applyMatrix4(g.matrixWorld).project(camera);
      const x = Math.abs(probe.x);
      edge = 1 - Math.min(Math.max((x - 0.42) / 0.40, 0), 1);
    }

    if (m) {
      const hover = m.uniforms.uHover;
      hover.value += ((active ? 1 : 0) - hover.value) * k;
      const dim = m.uniforms.uDim;
      const goal = (0.68 + depth * 0.32) * (0.12 + 0.88 * edge);
      dim.value += (goal - dim.value) * k;
      m.uniforms.uReveal.value = reveal;
    }

    if (g) {
      const target = active ? 1.09 : 1;
      const s = g.scale.x + (target - g.scale.x) * k;
      g.scale.setScalar(s);

      // под курсором карточка выходит наружу из кольца, к зрителю
      lift.current += ((active ? 1 : 0) - lift.current) * k;
      const out = lift.current * 0.42;
      const len = Math.hypot(position[0], position[2]) || 1;

      g.position.set(
        (position[0] + (position[0] / len) * out) * reveal,
        position[1] * reveal,
        (position[2] + (position[2] / len) * out) * reveal,
      );
      g.rotation.y = rotationY;
      g.rotation.z = (1 - reveal) * 0.35;
    }
  });

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onOver();
        }}
        onPointerOut={onOut}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[CARD_W, CARD_H]} />
        <shaderMaterial
          ref={material}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
