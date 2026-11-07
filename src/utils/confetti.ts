import confetti from 'canvas-confetti';

export function fireSchoolPrideConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#0284c7', '#38bdf8', '#7c3aed']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#eab308', '#f59e0b', '#10b981']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#0284c7', '#eab308']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireSmallSuccessConfetti() {
  confetti({
    particleCount: 50,
    spread: 50,
    origin: { y: 0.8 },
    colors: ['#10b981', '#34d399', '#6ee7b7']
  });
}
