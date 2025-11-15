'use client'

import InputBox from '@/components/formComponents/InputBox';
import { useFormSync } from '@/hooks/useFormSync';
import DrawingPad, { DrawingPadRef } from '@/components/formComponents/drawingPad';
import { useState, useRef, useCallback } from 'react';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { useRouter } from 'next/navigation';
import DropDown from '@/components/formComponents/dropDown';
import { collection, addDoc, serverTimestamp, doc, writeBatch } from 'firebase/firestore';
import CheckBox from '@/components/formComponents/checkBoxes';
import { db } from '@/utils/firebase';

export default function AutoInfo() {
  const router = useRouter();
  useFormSync('autoInfo');

  const [numberOfPads, setNumberOfPads] = useState<number>(0);
  // Ensure the type is explicitly set for the current value of the ref
  const drawingPadRefs = useRef<Array<DrawingPadRef | null>>([]); // Explicitly use Array<T>
  const customHeadingsRef = useRef<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let value = parseInt(inputValue, 10);

    if (isNaN(value) || value < 0) {
      value = 0;
    }

    setNumberOfPads(value);
    customHeadingsRef.current = Array(value).fill('').map((_, i) => customHeadingsRef.current[i] || `Drawing Pad #${i + 1}`);

    // Create a new array and then assign it to .current
    // This is generally safer with useRef for arrays or objects
    const newDrawingPadRefs: Array<DrawingPadRef | null> = drawingPadRefs.current.slice(0, value);
    while (newDrawingPadRefs.length < value) {
      newDrawingPadRefs.push(null);
    }
    drawingPadRefs.current = newDrawingPadRefs; // Assign the new array back
  };

  const handleHeadingChange = useCallback((index: number, value: string) => {
    customHeadingsRef.current[index] = value;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!navigator.onLine) {
      alert("You are offline. Please connect to the internet to submit the form with images.");
      return;
    }

    if (!window.confirm('Submit this Auto Information?')) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const mainFormData: Record<string, string | string[]> = {};

    formData.forEach((value, key) => {
      if (!key.startsWith('autoName-') &&
          !key.startsWith('autoDescription-') &&
          !key.startsWith('scoringTypesAuto-') &&
          !key.startsWith('autoProblemsNotes-')
         ) {
        if (mainFormData[key]) {
          if (Array.isArray(mainFormData[key])) {
            (mainFormData[key] as string[]).push(value.toString());
          } else {
            mainFormData[key] = [mainFormData[key] as string, value.toString()];
          }
        } else {
          mainFormData[key] = value.toString();
        }
      }
    });
    mainFormData.createdAt = new Date().toISOString();

    const drawingsToUpload: { blob: Blob; autoSpecificData: Record<string, string | string[] | number> }[] = [];

    for (let i = 0; i < numberOfPads; i++) {
      const padRef = drawingPadRefs.current[i];
      const heading = customHeadingsRef.current[i] || `Drawing Pad #${i + 1}`;

      if (padRef && typeof padRef.getDrawingData === 'function') {
        try {
          const { blob } = await padRef.getDrawingData();
          if (blob && blob.size > 0) {
            const autoSpecificData: Record<string, string | string[] | number> = {
              autoName: formData.get(`autoName-${i}`)?.toString() || '',
              autoDescription: formData.get(`autoDescription-${i}`)?.toString() || '',
              scoringTypesAuto: 
              (Array.isArray(formData.getAll(`scoringTypesAuto-${i}`))
                ? (formData.getAll(`scoringTypesAuto-${i}`) as string[]).join(',')
                : formData.get(`scoringTypesAuto-${i}`)?.toString() || ''
              ),
              autoProblemsNotes: formData.get(`autoProblemsNotes-${i}`)?.toString() || '',
              heading: heading,
              originalAutoIndex: i,
            };
            drawingsToUpload.push({ blob, autoSpecificData });
          } else {
            console.warn(`No drawing data found for "${heading}" or drawing was empty. Skipping.`);
          }
        } catch (error: any) {
          console.error(`Failed to get drawing data for "${heading}":`, error);
          alert(`Failed to get drawing data for "${heading}": ${error.message}. Please try again.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    let mainSubmissionDocId: string | null = null;

    try {
      const mainSubmissionRef = await addDoc(collection(db, 'mainAutoInfoSubmissions'), {
        ...mainFormData,
        submittedAt: serverTimestamp(),
      });
      mainSubmissionDocId = mainSubmissionRef.id;
      console.log("Main form data saved to Firebase with ID:", mainSubmissionDocId);

      if (drawingsToUpload.length > 0) {
        const batch = writeBatch(db);

        for (const { blob, autoSpecificData } of drawingsToUpload) {
          try {
            const cloudinaryResponse = await uploadToCloudinary(blob);
            console.log(`Image for ${autoSpecificData.heading} uploaded to Cloudinary:`, cloudinaryResponse.secure_url);

            const autoDrawingDocRef = doc(collection(mainSubmissionRef, 'autoDrawings'));
            batch.set(autoDrawingDocRef, {
              ...autoSpecificData,
              drawingUrl: cloudinaryResponse.secure_url,
              linkedMainSubmissionId: mainSubmissionDocId,
              uploadedAt: serverTimestamp(),
            });
          } catch (uploadError: any) {
            console.error(`Cloudinary upload failed for ${autoSpecificData.heading}:`, uploadError);
            alert(`Failed to upload drawing for "${autoSpecificData.heading}". This drawing might be missing.`);
          }
        }
        await batch.commit();
        alert('Form submitted successfully, including all drawings!');
      } else {
        alert('Form submitted successfully (no drawings provided)!');
      }

    } catch (error: any) {
      console.error("Submission failed:", error);
      alert(`Submission failed: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
      const form = document.getElementById("autoInfoForm") as HTMLFormElement;
      form?.reset();
      drawingPadRefs.current.forEach(padRef => padRef?.clearDrawing());
      setNumberOfPads(0);
      customHeadingsRef.current = [];
      router.push('/html/dcInfo');
    }
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
          id="autoInfoForm"
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
            Auto Information
          </h1>
          <InputBox
            question="What-is-your-average-auto-speed?"
            categoryOfQuestion="auto-speed"
            placeholder="faster-than-you-can-say-jibber-wabber"
            type="text"
          />

          <InputBox
            question="What-is-your-auto-accuracy"
            categoryOfQuestion="auto-accuracy"
            placeholder="we-have-our-accuracy-within-a-half-mile"
            type="text"
          />

          <DropDown
            question="does-your-auot-experience-any-problems?"
            dataBaseId="failure-type"
            optionsArray={["It-hasn't-caught-fire-since-yesterday"]}
          />

          <InputBox
            question="What-is-your-artifact-cycle-time?"
            categoryOfQuestion="artifact-cycle"
            placeholder="10-seconds"
            type="text"
          />

          <InputBox
            question="What-is-your-depot-cycle-time?"
            categoryOfQuestion="depotCycleTime"
            placeholder="15 seconds"
            type="text"
          />

          <InputBox
            question="any-notes-on-your-auto?"
            categoryOfQuestion="auto-notes-important"
            placeholder="Our-robot-has-this-weird-quirk..."
            type="text"
          />


          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className="w-full px-3 mb-3">
              <label
                htmlFor="numPads"
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
              >
                How Many Different Autos do You Have?
              </label>
              <input
                className="
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
                  "
                type="number"
                id="numPads"
                name="numberOfAutos"
                value={numberOfPads}
                onChange={handleNumberChange}
                min="0"
              />
            </div>
          </div>

          <div>
            {Array.from({ length: numberOfPads }).map((_, index) => (
              <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-md mb-6 ">

                <InputBox
                  question="Name Of Auto"
                  categoryOfQuestion={`autoName-${index}`}
                  placeholder="Really Cool Name"
                  type="text"
                />

                <InputBox
                  question="Description Of Auto"
                  categoryOfQuestion={`autoDescription-${index}`}
                  placeholder="Really Cool Description"
                  type="text"
                />

                <CheckBox
                  question={`Scoring Types Used for Auto ${index + 1}`}
                  options={["Specimen Score", "Sample Score", "Push Bot", "No Scoring", "Other"]}
                  categoryOfQuestion={`scoringTypesAuto-${index}`}
                />

                <DrawingPad
                  ref={el => {
                    drawingPadRefs.current[index] = el;
                  }}
                  id={`drawing-pad-${index}`}
                  headingText={customHeadingsRef.current[index] || `Drawing Pad #${index + 1}`}
                />

                <InputBox
                  question="Problems with Auto + Notes"
                  categoryOfQuestion={`autoProblemsNotes-${index}`}
                  placeholder="Tell Us Your Secrets"
                  type="text"
                />
              </div>
            ))}
          </div>

          <InputBox
            question="What is your average speed in auto"
            categoryOfQuestion="autoSpeed"
            placeholder="Good"
            type="text"
          />

          <InputBox
            question="Auto Accuracy"
            categoryOfQuestion="autoAccuracy"
            placeholder="Good"
            type="text"
          />

          <InputBox
            question="Overall Problems with Auto"
            categoryOfQuestion="overallAutoProblems"
            placeholder="speed I am speed"
            type="text"
          />

          <InputBox
            question="Overall Notes on Auto"
            categoryOfQuestion="overallAutoNotes"
            placeholder="if you have no problems you did not try"
            type="text"
          />

          <div className="w-full flex space-x-8 items-start justify-center mb-6">
            <button
              type="button"
              onClick={() => {
                (document.getElementById("autoInfoForm") as HTMLFormElement)?.reset();
                drawingPadRefs.current.forEach(padRef => padRef?.clearDrawing());
                setNumberOfPads(0);
                customHeadingsRef.current = [];
                alert('Form cleared!');
              }}
              className="w-60 text-white font-bold py-4 rounded-lg bg-fred hover:opacity-85 space-x-4"
            >
              Clear
            </button>

            <button
              type="submit"
              className="w-60 text-white font-bold py-4 rounded-lg bg-fblue hover:opacity-85"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}