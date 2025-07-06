'use client'

import InputBox from '@/components/formComponents/InputBox';
import { useFormSync } from '@/hooks/useFormSync';
import { syncOfflineData } from '@/utils/syncOffline';
import DrawingPad, { DrawingPadRef } from '@/components/formComponents/drawingPad';
import { useRef } from 'react';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { useRouter } from 'next/navigation';

export default function TeamInfo() {
  useFormSync('endgameInfo');
  const drawingPadRef = useRef<DrawingPadRef>(null);
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm('Submit this team info?')) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((v, k) => (data[k] = v.toString()));
    data.createdAt = new Date().toISOString();

    let drawingUrl: string | null = null;
    if (drawingPadRef.current) {
      try {
        const { blob } = await drawingPadRef.current.getDrawingData();
        if (blob) {
          const cloudinaryResponse = await uploadToCloudinary(blob);
          drawingUrl = cloudinaryResponse.secure_url;
          console.log("Drawing uploaded to Cloudinary:", drawingUrl);
        } else {
          console.warn("No drawing data found from DrawingPad.");
        }
      } catch (error: any) {
        console.error("Failed to upload drawing:", error);
        alert("Failed to upload drawing: " + error.message);
        return; // Stop submission if drawing upload fails
      }
    }

    if (drawingUrl) {
      data.teamHangDrawingUrl = drawingUrl;
    } else {
      data.teamHangDrawingUrl = 'no_drawing_submitted';
    }

    // local storage and offline sync
    const buf = JSON.parse(localStorage.getItem("unsyncedForms") || "[]");
    buf.push(data);
    localStorage.setItem("unsyncedForms", JSON.stringify(buf));

    if (navigator.onLine) {
      try {
        await syncOfflineData('endgameInfo');
      } catch (syncError) {
        console.error("Error during online sync:", syncError);
        alert("Online sync failed. Your info is saved offline and will sync later");
      }
    } else {
      alert('Offline. Your info is saved offline and will sync when back online');
    }

    // reset form
    const form = document.getElementById("teamInfoForm") as HTMLFormElement;
    form?.reset();
    if (drawingPadRef.current) {
        drawingPadRef.current.clearDrawing();
    }

    // redirect
    router.push('/');
  };

  return (
    <main className="
      flex
      flex-col
      text-center
      gap-2
      items-center
      justify-center
      min-h-screen font-sans
      "
    >
      <div className="
        h-screen
        flex
        items-start
        justify-center
        mt-6
        "
      >
        <form
          id="teamInfoForm"
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-lg
            mb-20
            "
          >
          <h1 className="
            text-4xl
            font-bold
            text-gray-800
            dark:text-white
            -mx-3
            mb-6
            flex
            items-start
            justify-center
            "
          >
            Endgame Information
          </h1>
            <InputBox
                question="Team Name"
                categoryOfQuestion="teamName"
                placeholder="Dragons"
                type="text"
            />

            <InputBox
                question="Team Number"
                categoryOfQuestion="teamNumber"
                placeholder="10523"
                type="text"
            />

            <DrawingPad ref={drawingPadRef} id="team-hang-drawing-pad" headingText="Where can you hang in endgame?" />

            <InputBox
                question="Cycle time for level 2"
                categoryOfQuestion="level2"
                placeholder="2 minuets 30 sec"
                type="text"
            />

            <InputBox
                question="Tool Cycle time for level 3"
                categoryOfQuestion="level3"
                placeholder="15 seconds"
                type="text"
            />

            <InputBox
                question="How did you preform at the last competition in Endgame?"
                categoryOfQuestion="preformance"
                placeholder="Robot go BURRRRR!"
                type="text"
            />

            <InputBox
                question="Hang Accuracy"
                categoryOfQuestion="accuracy"
                placeholder="Good"
                type="text"
            />

            <InputBox
                question="Problems with Endgame"
                categoryOfQuestion="failures"
                placeholder="speed I am speed"
                type="text"
            />

            <InputBox
                question="Notes on Endgame"
                categoryOfQuestion="notes"
                placeholder="if you have no problems you did not try"
                type="text"
            />

            <div className="w-full flex space-x-8 items-start justify-center mb-6">
                <button type="button" onClick={() => {
                    (document.getElementById("teamInfoForm") as HTMLFormElement)?.reset();
                    if (drawingPadRef.current) drawingPadRef.current.clearDrawing();
                    alert('Form cleared!');
                }} className="w-60 text-white font-bold py-4 rounded-lg bg-fred hover:opacity-85 space-x-4">
                    Clear
                </button>

                <button type="submit" className="w-60 text-white font-bold py-4 rounded-lg bg-fblue hover:opacity-85">
                    Submit
                </button>
            </div>
        </form>
      </div>
    </main>
  );
}