import { api } from "@/trpc/react";

function ProfessionalHome() {

  const customerRequestQuery = api.customerRequest.all.useQuery()
 const CustomerRequestProgressQuery = api.customerRequest.all.useQuery()
  console.log("test1:", customerRequestQuery.data)
  if (!customerRequestQuery.data) return <div>Error 404</div>

  return (
    <div className="overflow-x-auto w-full h-full">
      <table className="table h-full w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {customerRequestQuery.data?.map((req, index) => (
            <tr key={index}>
              <td>
               {req.userId}
              </td>
              <td>{req.chatId}</td>
              <td>20 NOV 2023</td>
              <td></td>
            </tr>
              ))}
        </tbody>
      </table>
    </div>

  )
}


export default ProfessionalHome