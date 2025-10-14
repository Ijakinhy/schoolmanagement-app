"use client";

import { createUpdateAssignment } from "@/lib/actions";
import { assignmentSchema, AssignmentSchema } from "@/lib/datasource";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";
import MultiSelect from "../selectInput/SelectInput";


const AssignmentForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: AssignmentSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      lessonId: data?.lessonId,
    }
  });

  const [state, formAction] = useFormState(createUpdateAssignment, {
    success: false,
    error: false,
  });


  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(
        `Assignment ${type === "create" ? "created" : "updated"} successfully`
      );
      reset()
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new assignment" : "Edit assignment details"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        {type === "create" ? "Your are about to create a new assignment" : "Your are about to update a assignment"}
      </span>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <InputField
            label="Assignment title"
            name="title"
            placeholder="Assignment title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
          />
        </div>
        <InputField
          label=""
          name="id"
          defaultValue={data?.id?.toString()}
          register={register}
          error={errors?.id}
          hidden
        />
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Assignment lesson</label>
          <select defaultValue={""} id="grades" {...register("lessonId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled className="text-gray-400" >Choose a lesson</option>
            {relatedData?.lessons?.map((lesson: any) => (
              <option key={lesson.id} value={lesson.id} >
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId && (
            <p className="text-red-500">{errors.lessonId.message}</p>
          )}
        </div>

        <div>
          <MultiSelect
            name="results"
            defaultValue={data?.results?.map((student: any) => student.id) || []}
            control={control}
            options={relatedData?.results.map((result: any) => ({
              label: `${result.student.name} ${result.student.surname}: ${result.score}`,
              value: result.id,
            })) || []}
            label="Select results"
            placeholder="Choose results"
            className="mb-4"
          />
        </div>


        <div>
          <InputField
            label="Exam start time"
            name="startDate"
            type="datetime-local"
            placeholder="Assignment start Date"
            defaultValue={data?.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.startDate}
          />
        </div>
        <div>
          <InputField
            label="Assignment due Date"
            name="dueDate"
            type="datetime-local"
            placeholder="Exam end time"
            defaultValue={data?.dueDate ? new Date(data.dueDate).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.dueDate}
          />
        </div>
      </div>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
