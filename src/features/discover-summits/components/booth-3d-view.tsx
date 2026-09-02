'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import { MOUSE, TOUCH } from 'three';
import type { WebGLRenderer, Camera } from 'three';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { boothTierOptions } from '@/constants/summit-data';

interface TierDims {
  floor: number;
  height: number;
  furniture: 'none' | 'light' | 'full';
}

const tierDims: Record<string, TierDims> = {
  tabletop: { floor: 6, height: 4, furniture: 'none' },
  '10x10': { floor: 10, height: 8, furniture: 'light' },
  '20x20': { floor: 20, height: 10, furniture: 'full' },
  custom: { floor: 26, height: 12, furniture: 'full' }
};

// "Market Stand" by Quaternius (quaternius.com) — Public Domain (CC0 1.0),
// sourced from poly.pizza. No attribution required, credited here anyway.
function MarketStandModel({
  scale,
  position
}: {
  scale: number;
  position: [number, number, number];
}) {
  const { scene } = useGLTF('/models/market-stand.glb');
  return <primitive object={scene} scale={scale} position={position} />;
}
useGLTF.preload('/models/market-stand.glb');

function Booth({ dims }: { dims: TierDims }) {
  const { floor, height, furniture } = dims;
  const half = floor / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[floor, floor]} />
        <meshStandardMaterial color='#e7e2d8' />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -half]} castShadow>
        <boxGeometry args={[floor, height, 0.2]} />
        <meshStandardMaterial color='#f5f3ee' />
      </mesh>

      {/* Side walls (only for booked/enclosed tiers) */}
      {furniture !== 'none' && (
        <>
          <mesh position={[-half, height / 2, 0]} castShadow>
            <boxGeometry args={[0.2, height, floor]} />
            <meshStandardMaterial color='#efece4' />
          </mesh>
          <mesh position={[half, height / 2, 0]} castShadow>
            <boxGeometry args={[0.2, height, floor]} />
            <meshStandardMaterial color='#efece4' />
          </mesh>
        </>
      )}

      {/* Backlit LED panel on back wall */}
      <mesh position={[0, height * 0.6, -half + 0.15]}>
        <planeGeometry args={[floor * 0.5, height * 0.35]} />
        <meshStandardMaterial color='#2b6cb0' emissive='#2b6cb0' emissiveIntensity={0.4} />
      </mesh>

      {furniture !== 'none' && (
        <>
          {/* Reception stand — real imported model */}
          <Suspense fallback={null}>
            <MarketStandModel scale={floor / 10} position={[-half * 0.45, 0, half * 0.55]} />
          </Suspense>
          {/* Meeting table */}
          <mesh position={[half * 0.3, 0.4, 0]} castShadow>
            <cylinderGeometry args={[1, 1, 0.08, 24]} />
            <meshStandardMaterial color='#c9c2b3' />
          </mesh>
        </>
      )}

      {furniture === 'full' && (
        <>
          {/* Lounge sofa */}
          <mesh position={[half * 0.3, 0.35, half * 0.4]} castShadow>
            <boxGeometry args={[2.2, 0.7, 0.9]} />
            <meshStandardMaterial color='#8a6f5c' />
          </mesh>
          {/* Barstools around the table */}
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[half * 0.3 + Math.cos(a) * 1.6, 0.5, Math.sin(a) * 1.6]}
                castShadow
              >
                <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
                <meshStandardMaterial color='#5a5248' />
              </mesh>
            );
          })}
          {/* TV monitors */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * half * 0.6, height * 0.5, -half + 0.15]}>
              <boxGeometry args={[1.6, 1, 0.06]} />
              <meshStandardMaterial color='#111' />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

export function Booth3DView({ defaultTier = '20x20' }: { defaultTier?: string }) {
  const [tier, setTier] = useState(defaultTier);
  const dims = tierDims[tier] ?? tierDims['10x10'];
  const camDist = dims.floor * 1.6;
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<{ gl: WebGLRenderer; camera: Camera } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current?.requestFullscreen().catch(() => {});
    }
  }

  // R3F's own size measurement lands wrong if this mounts while its tab panel
  // is still hidden (0×0 box) — base-ui keeps both panels mounted. A dedicated
  // ResizeObserver on the container re-applies the real size whenever it
  // actually changes, including the hidden→visible transition on tab switch.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const applySize = () => {
      const r = rendererRef.current;
      if (!r) return;
      const { clientWidth: w, clientHeight: h } = el;
      if (w > 0 && h > 0) {
        r.gl.setSize(w, h);
        if ('aspect' in r.camera) {
          (r.camera as unknown as { aspect: number }).aspect = w / h;
        }
        if ('updateProjectionMatrix' in r.camera) {
          (r.camera as unknown as { updateProjectionMatrix: () => void }).updateProjectionMatrix();
        }
      }
    };
    const ro = new ResizeObserver(applySize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-center gap-1.5'>
        {boothTierOptions.map((opt) => (
          <Button
            key={opt.value}
            size='sm'
            variant={tier === opt.value ? 'default' : 'outline'}
            className={cn('h-7 rounded-lg px-2.5 text-xs')}
            onClick={() => setTier(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div
        ref={containerRef}
        className={cn(
          'bg-muted/30 relative h-[420px] w-full overflow-hidden rounded-xl border',
          isFullscreen && 'bg-background'
        )}
      >
        <Button
          type='button'
          size='icon-sm'
          variant='secondary'
          className='absolute top-3 right-3 z-10 active:scale-[0.97]'
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit full view' : 'Full view'}
        >
          {isFullscreen ? (
            <Icons.collapse className='size-4' />
          ) : (
            <Icons.expand className='size-4' />
          )}
        </Button>
        <Canvas
          shadows
          camera={{ position: [camDist * 0.7, camDist * 0.55, camDist * 0.7], fov: 45 }}
          onCreated={({ gl, camera }) => {
            rendererRef.current = { gl, camera };
            const el = containerRef.current;
            if (!el) return;
            const { clientWidth: w, clientHeight: h } = el;
            if (w > 0 && h > 0) {
              gl.setSize(w, h);
              if ('aspect' in camera) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
              }
            }
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 15, 8]}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Booth dims={dims} />
          <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={dims.floor * 2} blur={2} />
          <hemisphereLight args={['#fff7ea', '#3a3226', 0.7]} />
          <pointLight position={[-6, 6, 6]} intensity={0.4} />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={dims.floor * 0.6}
            maxDistance={dims.floor * 3}
            maxPolarAngle={Math.PI / 2 - 0.05}
            mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.PAN }}
            touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN }}
          />
        </Canvas>
      </div>

      <p className='text-muted-foreground text-xs'>
        Drag to rotate, scroll to zoom, middle or right-click drag to pan — or hit the expand icon
        for full view. Booth stand model by Quaternius (CC0) — swap in a branded model later without
        changing this viewer.
      </p>
    </div>
  );
}
