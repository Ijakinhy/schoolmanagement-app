"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { lessonSchema, LessonSchema } from "@/lib/datasource";
import MultiSelect from "../selectInput/SelectInput";
import { useFormState } from "react-dom";
import { createUpdateLesson } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";



const LessonForm = ({
  type,
  data,
  relatedData
}: {
  type: "create" | "update";
  data?: LessonSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      classId: data?.classId,
      teacherId: data?.teacherId,
      subjectId: data?.subjectId,
      day: data?.day,
    }
  });

  const [state, formAction] = useFormState(createUpdateLesson, {
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
            label="Lesson name"
            name="name"
            placeholder="Class name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
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
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Choose a subject</label>
          <select defaultValue={""} id="grades" {...register("subjectId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled >Choose a subject</option>
            {relatedData?.subjects?.map((subject: any) => (
              <option key={subject.id} value={subject.id} >
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <p className="text-red-500">{errors.subjectId.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Choose a class</label>
          <select defaultValue={""} id="grades" {...register("classId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a class</option>
            {relatedData?.classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id} >
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-red-500">{errors.classId.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Choose a teacher</label>
          <select id="grades" defaultValue={""} {...register("teacherId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a class</option>
            {relatedData?.teachers?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id} >
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId && (
            <p className="text-red-500">{errors.teacherId.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Choose a day</label>
          <select id="grades" defaultValue={""} {...register("day")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a day</option>
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <option key={day} value={day} >
                {day.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.day && (
            <p className="text-red-500">{errors.day.message}</p>
          )}
        </div>


        <div>
          <InputField
            label="Lesson start time"
            name="start"
            type="datetime-local"
            placeholder="Lesson start time"
            defaultValue={data?.start ? new Date(data.end).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.start}
          />
        </div>
        <div>
          <InputField
            label="Lesson end time"
            name="end"
            type="datetime-local"
            placeholder="Lesson end time"
            defaultValue={data?.end ? new Date(data.end).toISOString().slice(0, 16) : ""}
            register={register}
            error={errors?.end}
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

export default LessonForm;
