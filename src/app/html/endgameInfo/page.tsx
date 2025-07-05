'use client'

import InputBox from '../../../components/formComponents/InputBox';
import { useFormSync } from '@/hooks/useFormSync';
import { syncOfflineData } from '@/utils/syncOffline';
import DrawingPad from '@/components/formComponents/canvas';


export default function TeamInfo() {
  useFormSync('teamInfo');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!window.confirm('Submit this team info?')) return;

  const formData = new FormData(e.currentTarget);
  const data: Record<string, string> = {};
  formData.forEach((v, k) => (data[k] = v.toString()));
  data.createdAt = new Date().toISOString();

  const buf = JSON.parse(localStorage.getItem("unsyncedForms") || "[]");
  buf.push(data);
  localStorage.setItem("unsyncedForms", JSON.stringify(buf));

  if (navigator.onLine) await syncOfflineData('teamInfo');
  else alert('Offline. Your info will sync when back online.');

  const form = document.getElementById("teamInfoForm") as HTMLFormElement;
  form?.reset();
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
            >
            </InputBox>

            <InputBox
                question="Team Number"
                categoryOfQuestion="teamNumber"
                placeholder="10523"
                type="text"
            >
            </InputBox>

            {/* where can you hang in endgame? */}
            <DrawingPad />

            <InputBox
                question="Cycle time for level 2"
                categoryOfQuestion="level2"
                placeholder="2 minuets 30 sec"
                type="text"
            >
            </InputBox>

            <InputBox
                question="Tool Cycle time for level 3"
                categoryOfQuestion="level3"
                placeholder="15 seconds"
                type="text"
            >
            </InputBox>

            <InputBox
                question="How did you preform at the last competition in Endgame?"
                categoryOfQuestion="preformance"
                placeholder="Robot go BURRRRR!"
                type="text"
            >
            </InputBox>

            <InputBox
                question="Hang Accuracy"
                categoryOfQuestion="accuracy"
                placeholder="Good"
                type="text"
            ></InputBox>

            <InputBox
                question="Problems with Endgame"
                categoryOfQuestion="failures"
                placeholder="speed I am speed"
                type="text"
            >
            </InputBox>

            <InputBox
                question="Notes on Endgame"
                categoryOfQuestion="notes"
                placeholder="if you have no problems you did not try"
                type="text"
            >
            </InputBox>

            {/* submit/clear buttons */}
            <div className="w-full flex space-x-8 items-start justify-center mb-6">
                {/* clear button */}
                    <button type="button" id="clearButton" className="w-60 text-white font-bold py-4 rounded-lg bg-fred hover:opacity-85 space-x-4">
                        Clear
                    </button>

                {/* submit button */}
                    <button type="submit" className="w-60 text-white font-bold py-4 rounded-lg bg-fblue hover:opacity-85">
                        Submit
                    </button>
            </div>
      </form>
      </div>
    </main>
  );
}