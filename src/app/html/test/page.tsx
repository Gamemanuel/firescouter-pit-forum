// src/components/MultiDrawingPads.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import DrawingPad, { DrawingPadRef } from '@/components/formComponents/drawingPad'; // Import DrawingPadRef
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default function MultiDrawingPads() {
  const [numberOfPads, setNumberOfPads] = useState<number>(0);
  const [customHeadings, setCustomHeadings] = useState<string[]>([]);
  const drawingPadRefs = useRef<(DrawingPadRef | null)[]>([]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let value = parseInt(inputValue, 10);

    if (isNaN(value) || value < 0) {
      value = 0;
    }

    setNumberOfPads(value);
    setCustomHeadings(Array(value).fill('').map((_, i) => customHeadings[i] || `Drawing Pad #${i + 1}`));
    drawingPadRefs.current = Array(value).fill(null);
  };

  const handleHeadingChange = (index: number, newText: string) => {
    setCustomHeadings(prev => {
      const updatedHeadings = [...prev];
      updatedHeadings[index] = newText;
      return updatedHeadings;
    });
  };

  useEffect(() => {
    drawingPadRefs.current.length = numberOfPads;
    for (let i = 0; i < numberOfPads; i++) {
      if (!drawingPadRefs.current[i]) {
        drawingPadRefs.current[i] = null;
      }
    }
  }, [numberOfPads]);


  const handleSubmitAllDrawings = async () => {
    if (numberOfPads === 0) {
      alert('Please add at least one drawing pad before submitting.');
      return;
    }

    if (confirm('Are you sure you want to submit all drawings?')) {
      let combinedEntry = '';
      const uploadedImageUrls: { heading: string; url: string }[] = [];

      for (let i = 0; i < numberOfPads; i++) {
        const padRef = drawingPadRefs.current[i];
        const heading = customHeadings[i] || `Drawing Pad #${i + 1}`;

        if (padRef && typeof padRef.getDrawingData === 'function') {
          try {
            const { blob } = await padRef.getDrawingData();
            if (blob) {
              const cloudinaryResponse = await uploadToCloudinary(blob);
              uploadedImageUrls.push({ heading, url: cloudinaryResponse.secure_url });
            } else {
              console.warn(`No drawing data found for "${heading}". Skipping upload for this pad.`);
            }
          } catch (error: any) {
            console.error(`Failed to upload drawing "${heading}":`, error);
            alert(`Failed to upload drawing "${heading}": ${error.message}. Stopping submission.`);
            return;
          }
        } else {
             console.warn(`Ref for drawing pad #${i+1} (${heading}) is null or getDrawingData is missing.`);
        }
      }

      uploadedImageUrls.forEach(item => {
        combinedEntry += `${item.heading}\n${item.url}\n\n`;
      });

      if (combinedEntry.endsWith('\n\n')) {
        combinedEntry = combinedEntry.slice(0, -2);
      }

      try {
        await addDoc(collection(db, 'all_drawings_submissions'), {
          combinedDrawingData: combinedEntry,
          submittedAt: serverTimestamp(),
        });
        alert('All drawings uploaded and combined entry saved to Firebase successfully!');
        setNumberOfPads(0);
        setCustomHeadings([]);
      } catch (error: any) {
        console.error('Failed to save combined entry to Firebase:', error);
        alert('Failed to save combined drawing entry to Firebase: ' + error.message);
      }
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <label htmlFor="numPads" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Number of Drawing Pads:
        </label>
        <input
          type="number"
          id="numPads"
          value={numberOfPads}
          onChange={handleNumberChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {numberOfPads > 0 && (
        <button
          onClick={handleSubmitAllDrawings}
          className="w-full text-white font-bold py-4 rounded-lg bg-gradient-to-r from-green-700 to-green-500 hover:opacity-85 space-x-4 mb-6"
        >
          Submit All Drawings
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: numberOfPads }).map((_, index) => (
          <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-md">
            <div className="mb-2">
                <label htmlFor={`heading-${index}`} className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    Custom Heading:
                </label>
                <input
                    type="text"
                    id={`heading-${index}`}
                    value={customHeadings[index] || `Drawing Pad #${index + 1}`}
                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <DrawingPad
              ref={el => (drawingPadRefs.current[index] = el)}
              id={`drawing-pad-${index}`}
              headingText={customHeadings[index] || `Drawing Pad #${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}