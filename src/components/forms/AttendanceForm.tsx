"use client";

import { createUpdateAttendance } from "@/lib/actions";
import { attendanceSchema, AttendanceSchema } from "@/lib/datasource";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";


const AttendaceForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: AttendanceSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    resetField
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: data?.studentId,
      lessonId: data?.lessonId,
      present: data?.present,
    }
  });

  const [state, formAction] = useFormState(createUpdateAttendance, {
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
        `Attendance ${type === "create" ? "created" : "updated"} successfully`
      );
      reset()
      router.refresh();
    }
  }, [state, router, type]);




  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new attendace" : "Edit attendace details"}
      </h1>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <InputField
            label="Attendance Date"
            name="date"
            register={register}
            error={errors?.date}
            defaultValue={data?.date ? new Date(data.date).toISOString().slice(0, 16) : ""}
            type="datetime-local"
          />
        </div>
        {/* <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Student name</label>
          <select defaultValue={""} id="grades" {...register("studentId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option disabled className="text-gray-400" >Choose a lesson</option>
            {relatedData?.students?.map((std: any) => (
              <option key={std.id} value={std.id} >
                {std.name + " " + std.surname}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-red-500">{errors.studentId.message}</p>
          )}
        </div> */}
        <InputField
          label=""
          name="id"
          defaultValue={data?.id?.toString()}
          register={register}
          error={errors?.id}
          hidden
        />
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Lesson name</label>
          <select defaultValue={""} id="grades" {...register("lessonId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option className="text-gray-400" >Choose a lesson</option>
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
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Student Name</label>
          <select defaultValue={""} id="grades" {...register("studentId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option className="text-gray-400" >Choose an exam</option>
            {relatedData?.students?.map((std: any) => (
              <option key={std.id} value={std.id} >
                {std.name + " " + std.surname}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-red-500">{errors.studentId.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Present</label>
          <select defaultValue={""} id="grades" {...register("present")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option disabled className="text-gray-400" >Choose a lesson</option>
            <option value={"true"} >
              Present
            </option>
            <option value={"false"} >
              Absent
            </option>
          </select>
          {errors.studentId && (
            <p className="text-red-500">{errors.studentId.message}</p>
          )}
        </div>


      </div>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "update"}
      </button>
    </form>
  );
};

export default AttendaceForm;
