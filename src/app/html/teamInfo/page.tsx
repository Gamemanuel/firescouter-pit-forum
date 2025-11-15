'use client'

import InputBox from '@/components/formComponents/InputBox';
import DropDown from '@/components/formComponents/dropDown';
import { useFormSync } from '@/hooks/useFormSync';
import { syncOfflineData } from '@/utils/syncOffline';
import { useRouter } from 'next/navigation';

export default function TeamInfo() {

  // import the settings from the submission module useFormSync.ts
  // the collection name in firebase is "teamInfo"
  useFormSync('teamInfo');
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // stop default submission type
    e.preventDefault();
    
    // make sure that you want to submit the fourm
    if (!window.confirm('Submit this team info?')) return;

    // collect the fourm data
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((v, k) => (data[k] = v.toString()));
    data.createdAt = new Date().toISOString();

    // sync unsyned fourms (check if there is any forms that are not submitted and submit them)
    const buf = JSON.parse(localStorage.getItem("unsyncedForms") || "[]");
    buf.push(data);
    localStorage.setItem("unsyncedForms", JSON.stringify(buf));

    // if offline, queue the info localy and wait for connection
    if (navigator.onLine) await syncOfflineData('teamInfo');

    // reset the fourm
    const form = document.getElementById("teamInfoForm") as HTMLFormElement;
    form?.reset();

    router.push('/html/autoInfo');
  };
  // html content
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
            Team Information
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

            <DropDown
                question="Drivetrain Type"
                dataBaseId="drivetrain"
                optionsArray={["Mechanum", "6 wheel", "Tank", "omni", "4-wheel"]}
            ></DropDown>

            <InputBox
                question="Number of drivers"
                categoryOfQuestion="numDrivers"
                placeholder="2"
                type="number"
            >
            </InputBox>

            <InputBox
                question="Tool Type"
                categoryOfQuestion="tool"
                placeholder="Arm w/ Claw"
                type="text"
            >
            </InputBox>

            <InputBox
                question="How did you preform at the last competition?"
                categoryOfQuestion="preformance"
                placeholder="Robot go BURRRRR!"
                type="text"
            >
            </InputBox>

            <InputBox
                question="Weight of the Robot (pounds)"
                categoryOfQuestion="weight"
                placeholder="142"
                type="number"
            ></InputBox>

            <InputBox
                question="How fast does you robot get to speed and what is your top speed"
                categoryOfQuestion="speed"
                placeholder="speed I am speed"
                type="text"
            >
            </InputBox>

            <InputBox
                question="Notes on Robot"
                categoryOfQuestion="notes"
                placeholder="Robot is awsome"
                type="text"
            >
            </InputBox>


            <InputBox
                question="Is the Robot a Kit Bot?"
                categoryOfQuestion="kitBot"
                placeholder="No"
                type="text"
            >
            </InputBox>

            <InputBox
                question="How many artifacts can you hold"
                categoryOfQuestion="artifactCount"
                placeholder="20"
                type="number"
            >
            </InputBox>

            <InputBox
                question="How do you plan on scoring"
                categoryOfQuestion="scorePlan"
                placeholder="yeah"
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