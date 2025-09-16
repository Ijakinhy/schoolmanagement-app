"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { subjectSchema, SubjectSchema } from "@/lib/datasource";
import { createSubject } from "@/lib/actions";
import { memo, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const SubjectForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });
  const [state, formAction] = useFormState(createSubject, { success: false, error: false })

  const onSubmit = handleSubmit((data) => {
    formAction(data)

  });
  const router = useRouter()
  useEffect(() => {
    if (state.success) {
      toast(`Subject ${type === "create" ? "created" : "updated"} successfully`)
      resetField("name")
      router.refresh()
    }

  }, [state])
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Edit subject details"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">

        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <input type="hidden" {...register("id")} defaultValue={data?.id} />
      </div>
      {state.error && <p className="text-xs text-red-400">Something went wrong</p>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "update"}
      </button>
    </form>
  );
};

export default memo(SubjectForm);
