import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  connection: number;
}

export const DnaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `hsla(${220 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%, ${0.3 + Math.random() * 0.4})`,
        connection: 100 + Math.random() * 50
      }));
    };

    const drawParticle = (particle: Particle) => {
      if (!ctx) return;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      // Create connections between particles
      particlesRef.current.forEach(p2 => {
        const dx = particle.x - p2.x;
        const dy = particle.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particle.connection) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 149, 237, ${0.1 * (1 - distance / particle.connection)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    };

    const updateParticle = (particle: Particle) => {
      // Mouse interaction
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        particle.x -= Math.cos(angle) * 0.5;
        particle.y -= Math.sin(angle) * 0.5;
      }

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      // Add glow effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(30, 40, 80, 0.2)');
      gradient.addColorStop(1, 'rgba(10, 20, 40, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          background: 'linear-gradient(125deg, #090b1f 0%, #171b3c 50%, #0a0f29 100%)'
        }}
      />
      <div className="fixed inset-0 -z-9 bg-gradient-to-b from-transparent via-blue-900/5 to-purple-900/10 pointer-events-none" />
    </>
  );
};