import { api } from "@/trpc/react";
import Link from "next/link";


function ProfessionalHome() {

  const customerRequestQuery = api.customerRequest.all.useQuery()
  const CustomerRequestProgress = api.customerRequest.create.useMutation()
console.log("test1",customerRequestQuery.data?.[0].progress)
  if (!customerRequestQuery.data) return <div>Error 404</div>

  return (
    <div className="overflow-x-auto w-full h-full">
      <table className="table h-full w-full">
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
              <td><Link href={`/chat/${req.chatId}`}>{req.chatId}</Link></td>
              <td>{req.progress}</td>
              <td>{req.additionalNotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}


export default ProfessionalHome