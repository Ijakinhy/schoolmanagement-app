"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TeacherSchema, teacherSchema } from "@/lib/datasource";
import MultiSelect from "../selectInput/SelectInput";
import { useFormState } from "react-dom";
import { createUpdateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

type Inputs = z.infer<typeof teacherSchema>;

const TeacherForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: TeacherSchema;
  relatedData?: Record<string, any>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      subjects: data?.subjects?.map((subject: any) => subject.id),
      classes: data?.classes?.map((cls: any) => cls.id),
    }
  });
  const [img, setImg] = useState<any>();
  const [preview, setPreview] = useState<string>("");


  const [state, formAction] = useFormState(createUpdateTeacher, {
    success: false,
    error: false,
  });


  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, image: img?.secure_url });
  });

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(
        `Teacher ${type === "create" ? "created" : "updated"} successfully`
      );
      reset()
      router.refresh();
    }
  }, [state, router, type]);

  return (
    <form method="POST" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new teacher"
          : "Update teacher Information"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-7">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
          placeholder="Username"
        />
        <InputField
          label="Password"
          name="password"
          register={register}
          error={errors?.password}
          placeholder="Password"
        />
        <InputField
          label="name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
          placeholder="Name"
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname}
          placeholder="Surname"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
          placeholder="Email"
        />

        <InputField
          label="Phone Number"
          name="phone"
          defaultValue={data?.phone ?? ""}
          register={register}
          error={errors.phone}
          placeholder="Phone Number"
        />
        <InputField
          label="Address"
          name="address"
          placeholder="Address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}

        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}

          />
        )}
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday ? new Date(data.birthday).toISOString().split("T")[0] : ""}
          register={register}
          error={errors.birthday}
          placeholder="Birthday"
          type="date"
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="" disabled>Gender</option>
            <option value="Male">Male</option>
            <option value="Famale">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div>
          <MultiSelect
            name="subjects"
            control={control}
            options={relatedData?.subjects.map((subject: any) => ({
              label: `${subject.name}`,
              value: subject.id,
            })) || []}
            label="Subjects"
            placeholder="Choose subjects"
            className="mb-4"
          />
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        <div>
          <MultiSelect
            name="classes"
            control={control}
            options={relatedData?.classes.map((cls: any) => ({
              label: cls.name,
              value: cls.id,
            })) || []}
            label="Classes"
            placeholder="Choose classes"
            className="mb-4"
          />
          {errors.classes?.message && (
            <p className="text-xs text-red-400">
              {errors.classes.message.toString()}
            </p>
          )}
        </div>
      </div>
      <CldUploadWidget uploadPreset="schoolmanagement" onSuccess={(result, { widget }) => {
        setImg(result.info)
        setPreview((result.info as CloudinaryUploadWidgetInfo).secure_url)
        widget.close()
        // setValue("image", (result?.info as CloudinaryUploadWidgetInfo).secure_url)
      }}>
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 w-56 h-full cursor-pointer"
              onClick={() => open()}
            >

              {(preview || data?.image) ? (
                <>
                  <Image
                    src={preview || data?.image!}
                    alt="Teacher photo"
                    className="rounded-full w-14 h-14"
                    width={60}
                    height={60}
                  />
                  <span>Change photo</span>
                </>
              ) : (
                <>
                  <Image src="/upload.png" alt="Upload" width={28} height={28} />
                  <span>Upload a photo</span>
                  {errors.image?.message && (
                    <p className="text-xs text-red-400">{errors.image.message}</p>
                  )}
                </>
              )}


            </div>
          );
        }}
      </CldUploadWidget>
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
