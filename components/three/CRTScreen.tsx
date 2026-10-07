"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getCRT } from "@/lib/terminal/crt";

/** The curved CRT glass. Its texture is the terminal's 2D canvas, re-uploaded on every redraw. */
export function CRTScreen() {
  const crt = useMemo(() => getCRT(), []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(crt.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [crt]);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.48, 1.86, 24, 18);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / 1.24;
      const y = pos.getY(i) / 0.93;
      pos.setZ(i, 0.07 * (1 - x * x * 0.6) * (1 - y * y * 0.6)); // gentle bulge
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(
    () =>
      crt.onDraw(() => {
        texture.needsUpdate = true;
      }),
    [crt, texture],
  );
  useEffect(
    () => () => {
      texture.dispose();
      geometry.dispose();
    },
    [texture, geometry],
  );

  return (
    <mesh geometry={geometry} position={[0, 2.22, 1.38]}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
