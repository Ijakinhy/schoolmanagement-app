import { currentUser } from "@clerk/nextjs/server"

const user =  await  currentUser()
export const role =  (user?.publicMetadata as {role:string}).role
export  const currentUserId =  user?.id