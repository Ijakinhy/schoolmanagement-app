"use client";

import { createUpdateAnnouncement, createUpdateAttendance, createUpdateEvent } from "@/lib/actions";
import {
  announcementSchema,
  AnnouncementSchema,
  attendanceSchema,
  AttendanceSchema,
  EventSchema,
} from "@/lib/datasource";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";

const AnnouncementForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: AnnouncementSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    resetField,
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      classId: data?.classId,
    },
  });

  const [state, formAction] = useFormState(createUpdateAnnouncement, {
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
        `Event ${type === "create" ? "created" : "updated"} successfully`
      );
      reset();
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new announcement"
          : "Edit announcement details"}
      </h1>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <InputField
            label="Announcement title"
            name="title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
          />
        </div>

        <div>
          <InputField
            label="Announcement date"
            name="date"
            register={register}
            error={errors?.date}
            defaultValue={
              data?.date
                ? new Date(data.date).toISOString().slice(0, 16)
                : ""
            }
            type="datetime-local"
          />
        </div>
        <div>
          <label
            className="block mb-2 text-xs text-gray-500"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            defaultValue={data?.description}
            className="ring-[1.5px] ring-gray-300  p-2 rounded-md text-sm w-full"
            id="description"
            cols={30}
            rows={3}
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="text-xs text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="grades" className="block my-3 text-xs text-gray-500 ">
            Class Name
          </label>
          <select
            defaultValue={""}
            id="grades"
            {...register("classId")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5"
          >
            <option className="text-gray-400">Choose an class</option>
            {relatedData?.classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-red-500">{errors.classId.message}</p>
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


      </div>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "update"}
      </button>
    </form>
  );
};

export default AnnouncementForm;
