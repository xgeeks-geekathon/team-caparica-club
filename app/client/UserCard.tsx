

import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { auth } from '@/auth'




export default async function UserCard() {
  const session = await auth();
  // const [process, setProcess] = useState('Ready'); 
  // const handleStatusChange = (event: { target: { value: SetStateAction<string> } }) => {
  //   setProcess(event.target.value);
  // };
  // const handleEditClick = () => {

  //   console.log('Selected Status:', process);
  //   // Add logic to save the status to your backend or perform other actions
  // };

  return (
    <div className="flex h-screen bg-gray-800">
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold">Profile</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label> :
              <Label htmlFor="username"> {session.user.name}</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Label htmlFor="username"> {session.user.email}</Label>
          </div>
          <div className="space-y-2">

            <label htmlFor="status" className="block text-sm font-medium text-white">
              Status:
            </label>
            <select
              id="process"
              name="process"
              // value={process}
              // onChange={handleStatusChange}
              className="block appearance-none w-full text-white bg-gray-800 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
            >
              <option value="Progress">Progress</option>
              <option value="Done">Done</option>
              <option value="Ready">Ready</option>
            </select>
          </div>

          {/* <Button className="bg-gray-800 text-white"
          //  onClick={handleEditClick}
           >
            Edit
          </Button> */}
        </div>
      </div>

    </div>
  )
}
