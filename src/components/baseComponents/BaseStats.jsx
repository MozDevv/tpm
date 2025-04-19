import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

const BaseStats = ({
  stats,
  columns = 4,
  shadow = 'md',
  rounded = 'xl',
  hoverEffect = 'shadow',
  padding = 'md',
  gap = 'md',
  className = '',
}) => {
  const router = useRouter();

  // Map props to Tailwind classes
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  }[columns];

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  }[shadow];

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }[padding];

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }[gap];

  const hoverClasses = {
    shadow: 'hover:shadow-lg',
    scale: 'hover:scale-[1.02]',
    both: 'hover:shadow-md hover:scale-[1.02]',
    none: '',
  }[hoverEffect];

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      event.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.style.backgroundColor = 'rgba(0, 105, 144, 0.1)';
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 600ms linear';
    circle.style.pointerEvents = 'none';

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  return (
    <div className={`mx-4 pr-4 grid ${gridColumns} ${gapClasses} ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={(e) => {
            createRipple(e);
            stat.handler ? stat.handler() : stat.path && router.push(stat.path);
          }}
          className={`relative overflow-hidden flex items-center justify-between bg-white ${shadowClasses} ${roundedClasses} ${paddingClasses} ${
            stat.path || stat.handler ? 'cursor-pointer' : ''
          } transition-all duration-300 ${hoverClasses} ${
            stat.className || ''
          }`}
        >
          <div>
            <h3 className="text-xl font-bold text-primary">{stat.value}</h3>
            <p className="text-gray-500 text-[14px] mt-3">{stat.label}</p>
          </div>
          <div className="text-2xl">{stat.icon}</div>

          {/* Add CSS for the ripple animation */}
          <style jsx global>{`
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

export default BaseStats;
