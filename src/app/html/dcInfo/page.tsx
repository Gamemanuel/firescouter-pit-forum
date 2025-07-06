'use client'

import InputBox from '@/components/formComponents/InputBox';
import { useFormSync } from '@/hooks/useFormSync';
import { syncOfflineData } from '@/utils/syncOffline';
import DrawingPad, { DrawingPadRef } from '@/components/formComponents/drawingPad';
import { useRef } from 'react';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { useRouter } from 'next/navigation';

export default function TeamInfo() {
  // Create a unique ref for each DrawingPad
  const samplesDrawingPadRef = useRef<DrawingPadRef>(null);
  const netZoneDrawingPadRef = useRef<DrawingPadRef>(null);
  const teamHangDrawingPadRef = useRef<DrawingPadRef>(null);

  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm('Submit this team info?')) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((v, k) => (data[k] = v.toString()));
    data.createdAt = new Date().toISOString();

    // Function to handle drawing upload for a specific ref and data key
    const uploadDrawingAndSetData = async (
      ref: React.RefObject<DrawingPadRef>,
      dataKey: string
    ) => {
      let drawingUrl: string | null = null;
      if (ref.current) {
        try {
          const { blob } = await ref.current.getDrawingData();
          if (blob) {
            const cloudinaryResponse = await uploadToCloudinary(blob);
            drawingUrl = cloudinaryResponse.secure_url;
            console.log(`Drawing for ${dataKey} uploaded to Cloudinary:`, drawingUrl);
          } else {
            console.warn(`No drawing data found for ${dataKey}.`);
          }
        } catch (error: any) {
          console.error(`Failed to upload drawing for ${dataKey}:`, error);
          alert(`Failed to upload drawing for ${dataKey}: ` + error.message);
          throw error; // Re-throw to stop submission if an upload fails
        }
      }
      data[dataKey] = drawingUrl || 'no_drawing_submitted';
    };

    try {
      // Upload each drawing individually
      await uploadDrawingAndSetData(samplesDrawingPadRef, 'samplesDrawingUrl');
      await uploadDrawingAndSetData(netZoneDrawingPadRef, 'netZoneDrawingUrl');
      await uploadDrawingAndSetData(teamHangDrawingPadRef, 'teamHangDrawingUrl');
    } catch (error) {
      return; // Stop submission if any drawing upload failed
    }

    // local storage and offline sync
    const buf = JSON.parse(localStorage.getItem("unsyncedForms") || "[]");
    buf.push(data);
    localStorage.setItem("unsyncedForms", JSON.stringify(buf));

    if (navigator.onLine) {
      try {
        await syncOfflineData('dcInfo');
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
    // Clear each drawing pad
    if (samplesDrawingPadRef.current) {
      samplesDrawingPadRef.current.clearDrawing();
    }
    if (netZoneDrawingPadRef.current) {
      netZoneDrawingPadRef.current.clearDrawing();
    }
    if (teamHangDrawingPadRef.current) {
      teamHangDrawingPadRef.current.clearDrawing();
    }

    // redirect
    router.push('/html/endgameInfo');
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
            Driver Control Information
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

            <InputBox
                question="Cyle time for samples and primary level"
                categoryOfQuestion="samples"
                placeholder="Sample Cycle time"
                type="text"
            />

            <DrawingPad ref={samplesDrawingPadRef} id="samples-draw" headingText="how do you score samples (primary method)" />

            <InputBox
                question="cycle time for Net Zone"
                categoryOfQuestion="Specimen"
                placeholder="Specimen cycle time"
                type="text"
            />

            <DrawingPad ref={netZoneDrawingPadRef} id="net-zone-draw" headingText="how do you score in the net zone (primary method)" />

            <InputBox
                question="Cyle time for Specimen and primary bar"
                categoryOfQuestion="Specimen"
                placeholder="Specimen cycle time"
                type="text"
            />

            <DrawingPad ref={teamHangDrawingPadRef} id="team-hang-drawing-pad" headingText="how do you score on the submersible (primary)" />

            <InputBox
                question="Issues in Driver Controll"
                categoryOfQuestion="issues"
                placeholder="Robot Go BURRRRR"
                type="text"
            />

            <InputBox
                question="Driver Controll Accuracy"
                categoryOfQuestion="accuracy"
                placeholder="Good"
                type="text"
            />

            <InputBox
                question="Common Problems with Driver Controlle"
                categoryOfQuestion="dcProblems"
                placeholder="if you have no problems you did not try"
                type="text"
            />

            <InputBox
                question="Struggles"
                categoryOfQuestion="struggles"
                placeholder="keep moving forward"
                type="text"
            />

            <InputBox
                question="Notes on Driver controll"
                categoryOfQuestion="notes"
                placeholder="if you have no problems you did not try"
                type="text"
            />

            <div className="w-full flex space-x-8 items-start justify-center mb-6">
                <button type="button" onClick={() => {
                    (document.getElementById("teamInfoForm") as HTMLFormElement)?.reset();
                    // Clear all drawing pads
                    if (samplesDrawingPadRef.current) samplesDrawingPadRef.current.clearDrawing();
                    if (netZoneDrawingPadRef.current) netZoneDrawingPadRef.current.clearDrawing();
                    if (teamHangDrawingPadRef.current) teamHangDrawingPadRef.current.clearDrawing();
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