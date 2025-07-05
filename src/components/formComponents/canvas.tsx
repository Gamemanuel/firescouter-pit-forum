'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export type DrawingPadHandle = {
  getImageData: () => string;
};

const DrawingPad = forwardRef<DrawingPadHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearBtnRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const drawingState = useRef({
    drawing: false,
    lastX: 0,
    lastY: 0
  });

  // Expose image export method
  useImperativeHandle(ref, () => ({
    getImageData: () => canvasRef.current?.toDataURL('image/png') ?? ''
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = '/img/field/field-2024-juice-dark.png';

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    imageRef.current = img;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      drawingState.current.drawing = true;
      const { x, y } = getMousePos(e);
      drawingState.current.lastX = x;
      drawingState.current.lastY = y;
    };

    const onMouseMove = (e: MouseEvent) => {
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
    };

    const onMouseUp = () => {
      drawingState.current.drawing = false;
      ctx.beginPath();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    const clearBtn = clearBtnRef.current;
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to clear this drawing?')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      });
    }

    // Clean up event listeners
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3 mb-4">
        <label
          className="block text-left uppercase tracking-wide text-gray-800 dark:text-white text-xs font-bold mb-2"
          htmlFor="drawing"
        >
        drawing pad
        </label>
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-3 px-4">
          <canvas
            ref={canvasRef}
            width={479}
            height={479}
            className="mb-4 block w-full rounded-lg overflow-hidden"
          />
          <button
            ref={clearBtnRef}
            className="w-full text-white font-bold py-4 rounded-lg bg-fred hover:opacity-85"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
});

export default DrawingPad;