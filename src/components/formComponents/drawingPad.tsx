'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Define the interface for the methods this component will expose to its parent
export interface DrawingPadRef {
  getDrawingData: () => Promise<{ blob: Blob | null; }>; // Removed dataUrl as it's not explicitly used here
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
    // Renamed drawingState to pixelDrawingState for clarity, as it's for pixel drawing
    const pixelDrawingState = useRef<{ drawing: boolean; lastX: number; lastY: number }>({ drawing: false, lastX: 0, lastY: 0 });

    // Function to draw the background image
    const drawBackgroundImage = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const img = new Image();
        img.src = '/img/field/feild.webp';

        img.onload = () => {
          // Clear before drawing new image to prevent stacking
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = (err) => {
          console.error("Error loading background image:", err);
          // Fallback if image fails to load (optional: draw a solid color or pattern)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ccc'; // Light gray background
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        // If image is already complete (e.g., cached), draw it immediately
        if (img.complete) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Function to clear the canvas and redraw the background
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear everything
        drawBackgroundImage(); // Redraw only the background
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
          }, 'image/png'); // Specify image format
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

      // Initial drawing of background image when component mounts
      drawBackgroundImage();

      const getMousePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        // Calculate scale factors to handle CSS sizing vs. canvas resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      };

      const handleMouseDown = (e: MouseEvent) => {
        pixelDrawingState.current.drawing = true;
        const { x, y } = getMousePos(e);
        pixelDrawingState.current.lastX = x;
        pixelDrawingState.current.lastY = y;
        ctx.beginPath(); // Start a new path for a new line segment
        ctx.moveTo(x, y); // Move to the starting point of the new line
      };

      const handleMouseUp = () => {
        pixelDrawingState.current.drawing = false;
        ctx.closePath(); // Close the current path
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!pixelDrawingState.current.drawing) return;
        const { x, y } = getMousePos(e);

        ctx.lineTo(x, y); // Draw a line from the last point to the current point

        ctx.globalCompositeOperation = 'source-over'; // Default blending mode
        ctx.strokeStyle = '#a47fdf'; // Purple-ish color
        ctx.lineWidth = 5;

        ctx.lineJoin = 'round'; // Makes corners rounded
        ctx.lineCap = 'round';   // Makes line ends rounded
        ctx.stroke(); // Render the line

        pixelDrawingState.current.lastX = x;
        pixelDrawingState.current.lastY = y;
      };

      // Event Listeners
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseUp); // Stop drawing if mouse leaves canvas

      // Clean up listeners
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseUp);
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
              id={id} // Add ID to canvas element itself
              width={479} // Explicit width for canvas resolution
              height={479} // Explicit height for canvas resolution
              className="mb-4 appearance-none block w-full leading-tight rounded-lg overflow-hidden"
              style={{ touchAction: 'none' }} // Prevents mobile scrolling when drawing
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