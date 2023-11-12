import { api } from "@/trpc/react";
import { CustomerRequestProgress } from "@prisma/client";
import Link from "next/link";


function ProfessionalHome() {

  const customerRequestQuery = api.customerRequest.all.useQuery()
  const CustomerRequestMutation = api.customerRequest.create.useMutation()

console.log("test1",customerRequestQuery.data?.[0].progress)
  if (!customerRequestQuery.data) return <div>Error 404</div>

  return (
    <div className="w-full h-full overflow-x-auto">
      <table className="table w-full h-full">
        <thead>
          <tr>
            <th>UserId</th>
            <th>ChatId</th>
            <th>Progress</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {customerRequestQuery.data?.map((req, index) => (
            <tr key={index}>
              <td>
                {req.userId}
              </td> 
              <td><Link href={`/chat-summary/${req.chatId}`}>{req.chatId}</Link></td>

              <td>
                {req.progress === CustomerRequestProgress.NotAssigned && 'Not Assigned'}
                {req.progress === CustomerRequestProgress.InProgress && 'In Progress'}
                {req.progress === CustomerRequestProgress.Done && 'Done'}
              </td>
              <td>{req.additionalNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}


export default ProfessionalHome