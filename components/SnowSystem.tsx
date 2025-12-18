import React, { createContext, useContext, useEffect, useRef } from 'react';

// --- Types & Context ---

interface SnowContextType {
  intensityRef: React.MutableRefObject<number>; 
}

const SnowContext = createContext<SnowContextType | null>(null);

export const useSnow = () => {
    const ctx = useContext(SnowContext);
    if (!ctx) throw new Error("useSnow must be used within SnowProvider");
    return ctx;
};

// --- Provider Component ---

export const SnowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const intensityRef = useRef(0);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Shake Detection Logic (Maintained for potential ambient effects)
  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      
      const totalAccel = Math.sqrt(x * x + y * y + z * z);

      if (totalAccel > 15) {
         intensityRef.current = 1.0; 
      }
    };

    window.addEventListener('devicemotion', handleMotion, true);
    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;

      const instantVelocity = Math.min(delta / 50, 1);
      if (intensityRef.current < 0.5) {
          intensityRef.current = Math.max(intensityRef.current, instantVelocity * 0.5);
      }
    };

    const decayLoop = () => {
        if (intensityRef.current > 0.001) {
            intensityRef.current *= 0.9; 
        } else {
            intensityRef.current = 0;
        }
        rafRef.current = requestAnimationFrame(decayLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    decayLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <SnowContext.Provider value={{ intensityRef }}>
      {children}
    </SnowContext.Provider>
  );
};

// --- Helper Draw Function (Shared Visuals) ---
const drawSnowflake = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// --- Ambient Snow Component ---

class AmbientParticle {
    x: number;
    y: number;
    vy: number;
    size: number;
    oscillationSpeed: number;
    oscillationAmp: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height; 
        this.reset(width, height, true);
    }

    reset(width: number, height: number, initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 3.5 + 1.5; 
        this.opacity = Math.random() * 0.5 + 0.3;
        this.vy = Math.random() * 0.8 + 0.4;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationAmp = Math.random() * 0.5 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update(width: number, height: number) {
        this.y += this.vy;
        this.x += Math.sin(this.y * this.oscillationSpeed) * this.oscillationAmp;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
            this.reset(width, height);
        }
        if (this.x > width + 20) this.x = -20;
        if (this.x < -20) this.x = width + 20;
    }

    draw(ctx: CanvasRenderingContext2D) {
        drawSnowflake(ctx, this.x, this.y, this.size, this.opacity, this.rotation);
    }
}

export const AmbientSnow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<AmbientParticle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            
            particles.current = Array.from({ length: 60 }).map(() => 
                new AmbientParticle(window.innerWidth, window.innerHeight)
            );
        };

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            ctx.clearRect(0, 0, width, height);
            
            particles.current.forEach(p => {
                p.update(width, height);
                p.draw(ctx);
            });

            animationFrameRef.current = requestAnimationFrame(render);
        };

        init();
        render();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
};
