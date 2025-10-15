"use server";
import { auth } from "@/lib/auth"

export const signInAction = async (data: FormData) => {

    const res = await auth.api.signInEmail({
        body: {
            email: data.get("email") as string,
            password: data.get("password") as string,
        }
    })
    console.log(res);

}