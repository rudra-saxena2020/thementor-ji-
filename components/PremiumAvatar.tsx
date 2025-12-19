import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, Group } from 'three';
import * as THREE from 'three';

interface PremiumAvatarProps {
  imageUrl: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  enableTracking?: boolean;
}

const AvatarMesh = ({ imageUrl, enableTracking }: { imageUrl: string; enableTracking: boolean }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Use suspense-enabled loader with error handling
  // We use a try-catch pattern indirectly via useLoader's behavior or fallback
  const texture = useLoader(TextureLoader, imageUrl);
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Blinking State
  const blinkRef = useRef(0);
  const nextBlinkTime = useRef(Math.random() * 3 + 2); // Random start blink
  
  // Eye tracking refs
  const leftEyeRef = useRef<Mesh>(null);
  const rightEyeRef = useRef<Mesh>(null);
    
  // Eyebrow refs for expressiveness
  const leftEyebrowRef = useRef<Mesh>(null);
  const rightEyebrowRef = useRef<Mesh>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Premium Material Configuration
  const materialProps = {
    map: texture,
    roughness: 0.6, // Balanced matte/gloss
    metalness: 0.1, // Slight sheen
    color: '#ffffff'
  };

  // Initial random offset for breathing
  const breathingOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Accessibility: Reset if reduced motion
    if (prefersReducedMotion) {
      meshRef.current.position.y = 0;
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.scale.set(1, 1, 1);
      if (leftEyeRef.current) leftEyeRef.current.visible = false;
      if (rightEyeRef.current) rightEyeRef.current.visible = false;
      if (leftEyebrowRef.current) leftEyebrowRef.current.visible = false;
      if (rightEyebrowRef.current) rightEyebrowRef.current.visible = false;
      return;
    }

    const time = state.clock.getElapsedTime();

    // 1. BREATHING
    const breathY = Math.sin(time * 1.0 + breathingOffset) * 0.02;
    meshRef.current.position.y = breathY;

    // Show eyes and eyebrows for tracking
    if (leftEyeRef.current) leftEyeRef.current.visible = true;
    if (rightEyeRef.current) rightEyeRef.current.visible = true;
    if (leftEyebrowRef.current) leftEyebrowRef.current.visible = true;
    if (rightEyebrowRef.current) rightEyebrowRef.current.visible = true;

    // 2. BLINKING
    blinkRef.current += delta;
    if (blinkRef.current >= nextBlinkTime.current) {
        const blinkDuration = 0.12;
        const progress = (blinkRef.current - nextBlinkTime.current) / blinkDuration;
        
        if (progress < 0.5) {
            // Closing
            meshRef.current.scale.y = THREE.MathUtils.lerp(1, 0.92, progress * 2);
            if (leftEyeRef.current) leftEyeRef.current.scale.y = THREE.MathUtils.lerp(1, 0.1, progress * 2);
            if (rightEyeRef.current) rightEyeRef.current.scale.y = THREE.MathUtils.lerp(1, 0.1, progress * 2);
            // Eyebrow movement during blink
            if (leftEyebrowRef.current) leftEyebrowRef.current.position.y = THREE.MathUtils.lerp(0.6, 0.55, progress * 2);
            if (rightEyebrowRef.current) rightEyebrowRef.current.position.y = THREE.MathUtils.lerp(0.6, 0.55, progress * 2);
        } else if (progress < 1) {
            // Opening
            meshRef.current.scale.y = THREE.MathUtils.lerp(0.92, 1, (progress - 0.5) * 2);
            if (leftEyeRef.current) leftEyeRef.current.scale.y = THREE.MathUtils.lerp(0.1, 1, (progress - 0.5) * 2);
            if (rightEyeRef.current) rightEyeRef.current.scale.y = THREE.MathUtils.lerp(0.1, 1, (progress - 0.5) * 2);
            // Eyebrow movement during blink
            if (leftEyebrowRef.current) leftEyebrowRef.current.position.y = THREE.MathUtils.lerp(0.55, 0.6, (progress - 0.5) * 2);
            if (rightEyebrowRef.current) rightEyebrowRef.current.position.y = THREE.MathUtils.lerp(0.55, 0.6, (progress - 0.5) * 2);
        } else {
            // Done
            meshRef.current.scale.y = 1;
            if (leftEyeRef.current) leftEyeRef.current.scale.y = 1;
            if (rightEyeRef.current) rightEyeRef.current.scale.y = 1;
            // Reset eyebrow positions
            if (leftEyebrowRef.current) leftEyebrowRef.current.position.y = 0.6;
            if (rightEyebrowRef.current) rightEyebrowRef.current.position.y = 0.6;
            blinkRef.current = 0;
            nextBlinkTime.current = Math.random() * 4 + 3; // Next blink in 3-7s
        }
    }

    // 3. ENHANCED TRACKING WITH SMOOTH ANIMATION
    if (enableTracking) {
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;

      const MAX_ROTATION_X = 0.3;
      const MAX_ROTATION_Y = 0.4;
      
      // Enhanced sensitivity for more responsive tracking
      const targetRotX = THREE.MathUtils.clamp(-mouseY * 0.4, -MAX_ROTATION_X, MAX_ROTATION_X);
      const targetRotY = THREE.MathUtils.clamp(mouseX * 0.4, -MAX_ROTATION_Y, MAX_ROTATION_Y);

      // Ultra-smooth interpolation with easing
      const smoothingFactor = 0.05; // Lower for smoother animation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, smoothingFactor);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, smoothingFactor);
      
      // Enhanced Z-tilt with more pronounced effect
      const zTilt = -targetRotY * 0.15;
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, zTilt, smoothingFactor * 0.8);
      
      // Subtle position movement for added depth
      const posX = targetRotY * 0.05;
      const posY = targetRotX * 0.03;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, posX, smoothingFactor * 0.7);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, posY + breathY, smoothingFactor * 0.7);
      
      // Eye tracking for more realistic effect
      if (leftEyeRef.current && rightEyeRef.current) {
        const eyeMovementX = THREE.MathUtils.clamp(mouseX * 0.3, -0.1, 0.1);
        const eyeMovementY = THREE.MathUtils.clamp(-mouseY * 0.2, -0.05, 0.05);
        
        leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.8 + eyeMovementX, smoothingFactor * 1.2);
        leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0.3 + eyeMovementY, smoothingFactor * 1.2);
        
        rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.8 + eyeMovementX, smoothingFactor * 1.2);
        rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0.3 + eyeMovementY, smoothingFactor * 1.2);
        
        // Eyebrow tracking for expressiveness
        if (leftEyebrowRef.current && rightEyebrowRef.current) {
          // Move eyebrows slightly with eye movement for expressiveness
          const browMovementX = eyeMovementX * 0.3;
          const browMovementY = eyeMovementY * 0.2;
          
          leftEyebrowRef.current.position.x = THREE.MathUtils.lerp(leftEyebrowRef.current.position.x, -0.8 + browMovementX, smoothingFactor * 1.1);
          leftEyebrowRef.current.position.y = THREE.MathUtils.lerp(leftEyebrowRef.current.position.y, 0.6 + browMovementY, smoothingFactor * 1.1);
          
          rightEyebrowRef.current.position.x = THREE.MathUtils.lerp(rightEyebrowRef.current.position.x, 0.8 + browMovementX, smoothingFactor * 1.1);
          rightEyebrowRef.current.position.y = THREE.MathUtils.lerp(rightEyebrowRef.current.position.y, 0.6 + browMovementY, smoothingFactor * 1.1);
          
          // Rotate eyebrows slightly based on vertical movement for expressiveness
          const browRotation = THREE.MathUtils.lerp(-0.2, -0.4, (mouseY + 1) / 2);
          leftEyebrowRef.current.rotation.x = THREE.MathUtils.lerp(leftEyebrowRef.current.rotation.x, browRotation, smoothingFactor);
          rightEyebrowRef.current.rotation.x = THREE.MathUtils.lerp(rightEyebrowRef.current.rotation.x, browRotation, smoothingFactor);
        }
      }
    } else {
      // Smooth reset to center position
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.06);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.06);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.06);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.06);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, breathY, 0.06);
      
      // Reset eye positions
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.8, 0.06);
        leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0.3, 0.06);
        rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.8, 0.06);
        rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0.3, 0.06);
      }
      
      // Reset eyebrow positions
      if (leftEyebrowRef.current && rightEyebrowRef.current) {
        leftEyebrowRef.current.position.x = THREE.MathUtils.lerp(leftEyebrowRef.current.position.x, -0.8, 0.06);
        leftEyebrowRef.current.position.y = THREE.MathUtils.lerp(leftEyebrowRef.current.position.y, 0.6, 0.06);
        rightEyebrowRef.current.position.x = THREE.MathUtils.lerp(rightEyebrowRef.current.position.x, 0.8, 0.06);
        rightEyebrowRef.current.position.y = THREE.MathUtils.lerp(rightEyebrowRef.current.position.y, 0.6, 0.06);
        leftEyebrowRef.current.rotation.x = THREE.MathUtils.lerp(leftEyebrowRef.current.rotation.x, -0.2, 0.06);
        rightEyebrowRef.current.rotation.x = THREE.MathUtils.lerp(rightEyebrowRef.current.rotation.x, -0.2, 0.06);
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <circleGeometry args={[2.8, 64]} /> 
        <meshStandardMaterial {...materialProps} transparent side={THREE.DoubleSide} />
      </mesh>
      
      {/* Eyes for enhanced tracking */}
      <mesh ref={leftEyeRef} position={[-0.8, 0.3, 2.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.8, 0.3, 2.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Eyebrows for expressiveness */}
      <mesh ref={leftEyebrowRef} position={[-0.8, 0.6, 2.7]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightEyebrowRef} position={[0.8, 0.6, 2.7]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.25, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

const FallbackAvatar = ({ imageUrl }: { imageUrl: string }) => (
  <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
);

// Error Boundary for the specific Canvas component
class AvatarErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const PremiumAvatar: React.FC<PremiumAvatarProps> = ({ 
  imageUrl, 
  size = 'md', 
  className = '',
  enableTracking = true
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
    '2xl': 'w-48 h-48'
  };

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeMap[size]} ${className}`} title="Interactive 3D Avatar">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
      
      <AvatarErrorBoundary fallback={<FallbackAvatar imageUrl={imageUrl} />}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }} 
          eventSource={typeof document !== 'undefined' ? document.body : undefined}
          eventPrefix="client"
          className="relative z-10"
          onCreated={({ gl }) => { 
             gl.setClearColor(new THREE.Color(0x000000), 0);
          }}
        >
          <ambientLight intensity={0.9} />
          <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
          <pointLight position={[-10, -5, -5]} intensity={0.2} color="#a78bfa" />
          <pointLight position={[0, 5, 2]} intensity={0.1} color="#ffffff" />
          
          <React.Suspense fallback={null}>
             <AvatarMesh imageUrl={imageUrl} enableTracking={enableTracking && !isMobile} />
          </React.Suspense>
        </Canvas>
      </AvatarErrorBoundary>
      
      {/* Overlays */}
      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent rounded-full pointer-events-none opacity-30"></div>
    </div>
  );
};

export default PremiumAvatar;