import InputBox from '../../formComponents/inputBox';
import DropDown from '../../formComponents/dropDown'
import DrawingPad from '../../formComponents/canvas'
// upload secrets
import { firebaseConfig, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../components/secrets';

export default function Home() {
  return (
    <main className="flex flex-col text-center gap-2 items-center justify-center min-h-screen font-sans">
      
      <div className="h-screen flex items-start justify-center">
        <form id="DriverInfoForm" className="w-full max-w-lg">
    <h1 className="text-4xl font-bold text-gray-100 -mx-3 mb-6 flex items-start justify-center">Driver Controll Information</h1>
      <InputBox
        question="test"
        categoryOfQuestion="test"
        placeholder="test"
        type="test"
      > 
      </InputBox>
      
      <DropDown
        question="test"
        dataBaseId="test"
        optionsArray={['apple', 'banana', 'orange']}
      >

      </DropDown>
      
      <DrawingPad>
      </DrawingPad>
      
      
      </form>
      </div>
    </main>
  );
}