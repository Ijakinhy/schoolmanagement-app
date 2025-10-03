// SubjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Import useForm
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { subjectSchema, SubjectSchema } from "@/lib/datasource";
import { createSubject } from "@/lib/actions";
import { memo, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MultiSelect from "../selectInput/SelectInput";

const SubjectForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    resetField,
    control,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: data?.name || "",
      teachers: data?.teachers?.map((t: any) => t.id) || [],
      id: data?.id || undefined,
    },
  });

  const [state, formAction] = useFormState(createSubject, {
    success: false,
    error: false,
  });


  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(
        `Subject ${type === "create" ? "created" : "updated"} successfully`
      );
      resetField("name");
      resetField("teachers");
      router.refresh();
    }
  }, [state, resetField, router, type]);



  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Edit subject details"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        <MultiSelect
          name="teachers"
          control={control}
          options={relatedData?.teachers.map((teacher: any) => ({
            label: `${teacher.name} ${teacher.surname}`,
            value: teacher.id,
          })) || []}
          label="Teachers"
          placeholder="Please choose at least one teacher"
          className="mb-4"
          rules={{ required: "Please select at least one teacher." }}
        />

        <input type="hidden" {...register("id")} defaultValue={data?.id} />
      </div>
      {errors.teachers && <p className="text-xs text-red-600">{errors.teachers.message}</p>}
      {state.error && (
        <p className="text-xs text-red-400">Something went wrong</p>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default memo(SubjectForm);