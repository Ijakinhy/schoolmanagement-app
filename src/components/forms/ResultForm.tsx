"use client";

import { createUpdateAssignment, createUpdateResult } from "@/lib/actions";
import { assignmentSchema, AssignmentSchema, resultSchema, ResultSchema } from "@/lib/datasource";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";
import MultiSelect from "../selectInput/SelectInput";


const ResultForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: ResultSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    resetField
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      assignmentId: data?.assignmentId,
      studentId: data?.studentId,
      examId: data?.examId,
      score: data?.score
    }
  });

  const [state, formAction] = useFormState(createUpdateResult, {
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
        `Result ${type === "create" ? "created" : "updated"} successfully`
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
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Student name</label>
          <select defaultValue={""} id="grades" {...register("studentId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option disabled className="text-gray-400" >Choose a lesson</option>
            {relatedData?.students?.map((lesson: any) => (
              <option key={lesson.id} value={lesson.id} >
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-red-500">{errors.studentId.message}</p>
          )}
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
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Assignment name</label>
          <select defaultValue={""} id="grades" {...register("assignmentId", {
            onChange: (e) => {
              if (e.target.value) {
                resetField("examId")
              }
            }
          })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option className="text-gray-400" >Choose a assignment</option>
            {relatedData?.assignments?.map((assignment: any) => (
              <option key={assignment.id} value={assignment.id} >
                {assignment.title}
              </option>
            ))}
          </select>
          {errors.assignmentId && (
            <p className="text-red-500">{errors.assignmentId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Exam Name</label>
          <select defaultValue={""} id="grades" {...register("examId", {
            onChange: (e) => {
              if (e.target.value) {
                resetField("assignmentId")
              }
            }
          })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option className="text-gray-400" >Choose an exam</option>
            {relatedData?.exams?.map((exam: any) => (
              <option key={exam.id} value={exam.id} >
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId && (
            <p className="text-red-500">{errors.examId.message}</p>
          )}
        </div>

        <div>
          <InputField
            label="Score"
            name="score"
            placeholder="Assignment or Exam score"
            register={register}
            error={errors?.score}
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

export default ResultForm;
