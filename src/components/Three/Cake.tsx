/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { CakeDesign, CakeTier } from '../../types';
import { FLAVORS, TIER_SIZES } from '../../constants';

interface CakeProps {
  design: CakeDesign;
}

interface StackedTier extends CakeTier {
  yPos: number;
  radius: number;
  height: number;
}

export function Cake({ design }: CakeProps) {
  const tiers = useMemo(() => {
    let currentHeight = 0;
    const tierSpacing = 0.05;
    const tierHeight = 1.0;

    return design.tiers.map((tier) => {
      const size = TIER_SIZES[tier.size] || 2;
      const yPos = currentHeight + tierHeight / 2;
      currentHeight += tierHeight + tierSpacing;

      return {
        ...tier,
        yPos,
        radius: size,
        height: tierHeight,
      };
    });
  }, [design.tiers]);

  const topIndex = tiers.length - 1;

  return (
    <group>
      {tiers.map((tier, index) => (
        <CakeTierComponent
          key={tier.id}
          tier={tier}
          shape={design.shape}
          isTopTier={index === topIndex}
          drip={design.drip}
          decorations={design.decorations}
          wording={design.wording}
        />
      ))}
      <ContactShadows />
    </group>
  );
}

function CakeTierComponent({
  tier,
  shape,
  isTopTier,
  drip,
  decorations,
  wording,
}: {
  tier: StackedTier;
  shape: string;
  isTopTier: boolean;
  drip: CakeDesign['drip'];
  decorations: CakeDesign['decorations'];
  wording: CakeDesign['wording'];
}) {
  const segments = shape === 'square' ? 4 : 64;
  const rotationY = shape === 'square' ? Math.PI / 4 : 0;
  const flavorColor = FLAVORS.find((flavor) => flavor.id === tier.flavor)?.color ?? '#f3e5ab';

  return (
    <group position={[0, tier.yPos, 0]} rotation={[0, rotationY, 0]}>
      <mesh>
        <cylinderGeometry args={[tier.radius, tier.radius, tier.height, segments]} />
        <meshStandardMaterial
          color={tier.frostingColor}
          roughness={tier.frostingType === 'fondant' ? 0.3 : 0.7}
          metalness={0.1}
        />
      </mesh>

      <mesh>
        <cylinderGeometry args={[tier.radius + 0.03, tier.radius + 0.03, tier.height * 0.16, segments]} />
        <meshStandardMaterial color={flavorColor} roughness={0.45} />
      </mesh>

      {drip.enabled && isTopTier && (
        <mesh position={[0, tier.height / 2 + 0.01, 0]}>
          <cylinderGeometry args={[tier.radius + 0.05, tier.radius + 0.05, 0.1, segments]} />
          <meshStandardMaterial color={drip.color} roughness={0.1} metalness={0.3} />
        </mesh>
      )}

      {isTopTier && decorations.length > 0 && (
        <group position={[0, tier.height / 2, 0]}>
          {decorations.map((decor, idx) => (
            <ToppingsRenderer key={`${decor.type}-${idx}`} type={decor.type} radius={tier.radius} shape={shape} ring={idx} />
          ))}
        </group>
      )}

      {isTopTier && wording.text && (
        <group position={[0, tier.height / 2 + 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={0.25}
            color={wording.color}
            maxWidth={tier.radius * 1.5}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#ffffff"
            depthOffset={1}
          >
            {wording.text}
          </Text>
        </group>
      )}
    </group>
  );
}

function ToppingsRenderer({
  type,
  radius,
  shape,
  ring,
}: {
  type: string;
  radius: number;
  shape: string;
  ring: number;
}) {
  const items = useMemo(() => {
    const scales = [0.78, 0.58, 0.4, 0.26];
    const scale = scales[ring] ?? 0.5;
    const y = 0.12 + ring * 0.16;
    const angleOffset = ring * 0.55;
    const result: { position: [number, number, number]; rotation: [number, number, number] }[] = [];

    if (shape === 'square') {
      const r = radius * scale;
      const rHalf = r * 0.55;
      result.push({ position: [r, y, 0], rotation: [0, 0, 0] });
      result.push({ position: [0, y, r], rotation: [0, -Math.PI / 2, 0] });
      result.push({ position: [-r, y, 0], rotation: [0, Math.PI, 0] });
      result.push({ position: [0, y, -r], rotation: [0, Math.PI / 2, 0] });
      result.push({ position: [rHalf, y, rHalf], rotation: [0, -Math.PI / 4, 0] });
      result.push({ position: [-rHalf, y, rHalf], rotation: [0, -3 * Math.PI / 4, 0] });
      result.push({ position: [-rHalf, y, -rHalf], rotation: [0, 3 * Math.PI / 4, 0] });
      result.push({ position: [rHalf, y, -rHalf], rotation: [0, Math.PI / 4, 0] });
    } else {
      const count = 6;
      const r = radius * scale;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + angleOffset;
        result.push({
          position: [Math.cos(angle) * r, y, Math.sin(angle) * r],
          rotation: [0, -angle, 0],
        });
      }
    }

    return result;
  }, [radius, shape, ring]);

  if (type === 'strawberry') {
    return (
      <group>
        {items.map((item, i) => (
          <mesh key={i} position={item.position} rotation={item.rotation}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ff0000" roughness={0.3} />
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.1, 0.05, 0.1]} />
              <meshStandardMaterial color="green" />
            </mesh>
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'macaron') {
    return (
      <group>
        {items.map((item, i) => (
          <group key={i} position={item.position} rotation={[Math.PI / 2, item.rotation[1], 0]}>
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ffb7c5" />
            </mesh>
            <mesh position={[0, 0, -0.05]} rotation={[Math.PI, 0, 0]}>
              <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#ffb7c5" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === 'chocolate_shard') {
    return (
      <group>
        {items.map((item, i) => (
          <mesh key={i} position={item.position} rotation={[0.4, item.rotation[1], 0.2]}>
            <boxGeometry args={[0.4, 0.6, 0.05]} />
            <meshStandardMaterial color="#3d1e1e" roughness={0.2} metalness={0.1} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'flowers') {
    return (
      <group>
        {items.map((item, i) => (
          <group key={i} position={item.position} rotation={item.rotation}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.2, 5]} />
              <meshStandardMaterial color="#e6e6fa" side={2} />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#ffd700" />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  return null;
}

function ContactShadows() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
}
