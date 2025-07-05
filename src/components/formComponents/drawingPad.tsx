'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Define the interface for the methods this component will expose to its parent
export interface DrawingPadRef {
  getDrawingData: () => Promise<{ blob: Blob | null; }>;
  clearDrawing: () => void;
}

// define the inputs
interface DrawingPadProps {
  id: string; // A unique ID for the canvas element
  headingText?: string; // custom heading text
}

const DrawingPad = forwardRef<DrawingPadRef, DrawingPadProps>(
  ({ id, headingText = "Team Hang Area" }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingState = useRef<{ drawing: boolean; lastX: number; lastY: number }>({ drawing: false, lastX: 0, lastY: 0 });

    // Function to clear the canvas and redraw the background
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = '/img/field/field-2024-juice-dark.png';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = (err) => {
          console.error("Error reloading background image after clear:", err);
        };
        if (img.complete) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Expose methods to the parent component
    useImperativeHandle(ref, () => ({
      getDrawingData: async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return { blob: null };
        }
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve({ blob });
          }, 'image/png');
        });
      },
      clearDrawing: () => {
          clearCanvas();
      }
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Initial drawing of background image
      const img = new Image();
      img.src = '/img/field/field-2024-juice-dark.png';

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = (err) => {
        console.error("Error loading background image:", err);
      };
      if (img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const getMousePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      };

      const handleMouseDown = (e: MouseEvent) => {
        drawingState.current.drawing = true;
        const { x, y } = getMousePos(e);
        drawingState.current.lastX = x;
        drawingState.current.lastY = y;
      };

      const handleMouseUp = () => {
        drawingState.current.drawing = false;
        ctx.beginPath();
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!drawingState.current.drawing) return;
        const { x, y } = getMousePos(e);

        ctx.beginPath();
        ctx.moveTo(drawingState.current.lastX, drawingState.current.lastY);
        ctx.lineTo(x, y);

        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#a47fdf';
        ctx.lineWidth = 5;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        drawingState.current.lastX = x;
        drawingState.current.lastY = y;
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);

      // Clean up listeners
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }, [id, headingText]); // Dependencies for canvas re-initialization

    return (
      <div className='flex flex-wrap -mx-3 mb-6'>
        <div className="w-full px-3 mb-4">
          <label
            className="block text-left uppercase tracking-wide text-gray-800 dark:text-white text-xs font-bold mb-2"
            htmlFor={id}
          >
            {headingText}
          </label>
          <div className='appearance-none block w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:border-purple-500'>
            <canvas
              ref={canvasRef}
              width={479}
              height={479}
              className="mb-4 appearance-none block w-full leading-tight rounded-lg overflow-hidden"
            />
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                    if (confirm('Are you sure you want to clear this drawing?')) {
                        clearCanvas();
                    }
                }}
                className="flex-1 w-full text-white font-bold py-4 rounded-lg bg-gradient-to-r from-red-700 to-red-500 hover:opacity-85"
              >
                Clear Drawing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DrawingPad.displayName = 'DrawingPad';
export default DrawingPad;