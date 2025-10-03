"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { classSchema } from "@/lib/datasource";
import { useFormState } from "react-dom";
import { createUpdateClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";


type Inputs = z.infer<typeof classSchema>;

const ClassForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: data?.name || "",
      supervisorId: data?.supervisorId || "",
      id: data?.id || undefined,
      capacity: data?.capacity || "",
      gradeId: data?.gradeId || "",
    }
  });
  const [state, formAction] = useFormState(createUpdateClass, {
    success: false,
    error: false,
  });


  const onSubmit = handleSubmit((formData) => {
    formAction(formData)
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(
        `Subject ${type === "create" ? "created" : "updated"} successfully`
      );
      // reset();
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Edit class details"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        {type === "create" ? "Your are about to create a new class" : "Your are about to update a class"}
      </span>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <InputField
            label="Class Name"
            name="name"
            placeholder="Class name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Class Supervisor</label>
          <select id="grades" {...register("supervisorId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a supervisor</option>

            {relatedData?.teachers?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId && (
            <p className="text-red-500">{errors.supervisorId.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Grades</label>
          <select id="grades" {...register("gradeId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a grade</option>
            {relatedData?.grades?.map((grade: any) => (
              <option key={grade.id} value={grade.id} >
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId && (
            <p className="text-red-500">{errors.gradeId.message}</p>
          )}
        </div>
        <InputField
          label="Class capacity"
          name="capacity"
          type="number"
          placeholder="Class capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
        {errors.capacity && (
          <p className="text-red-500">{errors.capacity.message}</p>
        )}
      </div>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "update"}
      </button>
    </form>
  );
};

export default ClassForm;
