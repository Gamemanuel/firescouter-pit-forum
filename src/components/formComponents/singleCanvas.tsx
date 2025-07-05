'use client'

import { useRef, useEffect } from 'react';

export default function DrawingPad() {
  const canvasRef = useRef(null);
  const clearBtnRef = useRef(null);
  const drawingState = useRef({ drawing: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load background image
    const img = new Image();
    img.src = '/img/field/field-2024-juice-dark.png';
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const getMousePos = e => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousedown', e => {
      drawingState.current.drawing = true;
      const { x, y } = getMousePos(e);
      drawingState.current.lastX = x;
      drawingState.current.lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
      drawingState.current.drawing = false;
      ctx.beginPath();
    });

    canvas.addEventListener('mousemove', e => {
      if (!drawingState.current.drawing) return;
      const { x, y } = getMousePos(e);

      ctx.beginPath();
      ctx.moveTo(drawingState.current.lastX, drawingState.current.lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#a47fdf';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      drawingState.current.lastX = x;
      drawingState.current.lastY = y;
    });

    const clearBtn = clearBtnRef.current;
    if (clearBtn) {
      clearBtn.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('Are you sure you want to clear this drawing?')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      });
    }``

    // Clean up listeners
    return () => {
      canvas.replaceWith(canvas.cloneNode(true));
      if (clearBtn) clearBtn.replaceWith(clearBtn.cloneNode(true));
    };

  }, []);

  return (
    <div className='
      flex
      flex-wrap
      -mx-3
      mb-6
      '
    >
      <div className="
        w-full
        px-3
        mb-4
        "
      >
        <label
          className="
            block
            text-left
            uppercase
            tracking-wide
            text-gray-800
            dark:text-white
            text-xs
            font-bold mb-2
            "
          htmlFor="test"
        >
          test
        </label>
        <div className='
          appearance-none
          block
          w-full
          bg-gray-100
          dark:bg-gray-800
          text-gray-900
          dark:text-gray-100
          border
          border-gray-300
          dark:border-gray-700
          rounded
          py-3
          px-4
          leading-tight
          focus:outline-none
          focus:border-purple-500
          '
        >
        <canvas
          ref={canvasRef} 
          width={479}
          height={479}
          className="
            mb-4
            appearance-none
            block
            w-full
            leading-tight
            rounded-lg
            overflow-hidden
            "
          />
        <button
          ref={clearBtnRef}
          className="
            w-full
            text-white
            font-bold
            py-4
            rounded-lg
            bg-gradient-to-r
            from-red-700
            to-red-500
            hover:opacity-85
            space-x-4
            "
            >
            Clear
        </button>
        </div>
      </div>
    </div>
  );
}