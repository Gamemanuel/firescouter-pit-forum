'use client';

import { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { syncOfflineData } from '@/utils/syncOffline';
import DrawingPad, { DrawingPadHandle } from '@/components/formComponents/canvas';
import { db } from '@/utils/firebase';

export default function Padge() {
  const [canvasIds, setCanvasIds] = useState<number[]>([]);
  const canvasRefs = useRef<DrawingPadHandle[]>([]);

  const addCanvas = () => {
    setCanvasIds((prev) => [...prev, prev.length]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm('Submit this scouting info?')) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((val, key) => (data[key] = val.toString()));
    data.createdAt = new Date().toISOString();

    // 🖼 Upload each canvas image
    const uploadedImages = [];
    for (const ref of canvasRefs.current) {
      const imageData = ref?.getImageData();
      if (imageData && imageData !== 'data:,') {
        try {
          const result = await uploadToCloudinary(
            imageData
          );
          uploadedImages.push({
            imageUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            timestamp: serverTimestamp(),
          });
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }
    }

    // ✅ Save image data to Firestore (if any)
    for (const img of uploadedImages) {
      await addDoc(collection(db, 'robotDrawings'), img);
    }

    // 💾 Buffer form data offline
    const buf = JSON.parse(localStorage.getItem('unsyncedForms') || '[]');
    buf.push(data);
    localStorage.setItem('unsyncedForms', JSON.stringify(buf));

    // Sync to Firestore if online
    if (navigator.onLine) {
      await syncOfflineData('endgameInfo');
    } else {
      alert('Offline—your submission will sync later.');
    }

    const form = e.currentTarget as HTMLFormElement | null;
    form?.reset();

  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">🛠️ Scouting Submission</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Inputs */}
        <input
          type="text"
          name="teamNumber"
          placeholder="Team Number"
          required
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="notes"
          placeholder="Endgame Notes"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Dynamic Canvas Section */}
        <div className="space-y-6">
          {canvasIds.map((id, index) => (
            <div key={id}>
              <label className="block font-medium mb-2">
                Canvas #{index + 1}
              </label>
              <DrawingPad
                ref={(el) => {
                  if (el) canvasRefs.current[index] = el;
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCanvas}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Drawing Canvas
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-bold py-3 rounded hover:bg-purple-700"
        >
          Submit Form & All Canvases
        </button>
      </form>
    </div>
  );
}