"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/datasource";
import MultiSelect from "../selectInput/SelectInput";
import { useFormState } from "react-dom";
import { createUpdateExam } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";


const ExameForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: ExamSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      lessonId: data?.lessonId,
    }
  });
  console.log(data, relatedData);

  const [state, formAction] = useFormState(createUpdateExam, {
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
        `Lesson ${type === "create" ? "created" : "updated"} successfully`
      );
      reset()
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Edit lesson details"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        {type === "create" ? "Your are about to create a new lesson" : "Your are about to update a lesson"}
      </span>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <InputField
            label="Exam title"
            name="title"
            placeholder="Exam title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
          />
        </div>
        <InputField
          label=""
          name="id"
          placeholder="Class name"
          defaultValue={data?.id?.toString()}
          register={register}
          error={errors?.id}
          hidden
        />
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Choose lesson</label>
          <select defaultValue={""} id="grades" {...register("lessonId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled >Choose a lesson</option>
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
            name="startTime"
            type="datetime-local"
            placeholder="Exam start time"
            defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.startTime}
          />
        </div>
        <div>
          <InputField
            label="Exam end time"
            name="endTime"
            type="datetime-local"
            placeholder="Exam end time"
            defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.endTime}
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

export default ExameForm;
