import InputBox from '../../formComponents/InputBox';
import DropDown from '../../formComponents/dropDown'
// upload secrets
import { firebaseConfig, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../components/secrets';

export default function Home() {
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
          id="DriverInfoForm" 
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

            {/* submit/clear buttons */}
            <div className="w-full flex space-x-8 items-start justify-center mb-6">
                {/* clear button */}
                    <button type="button" id="clearButton" className="w-60 text-white font-bold py-4 rounded-lg bg-fred hover:opacity-85 space-x-4">
                        Clear
                    </button>

                {/* submit button */}
                    <button type="submit" id="submit" className="w-60 text-white font-bold py-4 rounded-lg bg-fblue hover:opacity-85">
                        Submit
                    </button>
            </div>
      </form>
      </div>
    </main>
  );
}