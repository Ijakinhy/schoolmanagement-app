"use client";

import { createUpdateStudent } from "@/lib/actions";
import { studentSchema, StudentSchema } from "@/lib/datasource";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";




const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      classId: data?.classId,
      gradeId: data?.gradeId,
      parentId: data?.parentId,
      sex: data?.sex
    }
  });
  const [img, setImg] = useState<any>();
  const [preview, setPreview] = useState<string>("");

  const [state, formAction] = useFormState(createUpdateStudent, {
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
        `Student ${type === "create" ? "created" : "updated"} successfully`
      );
      reset()
      router.refresh();
    }
  }, [state, router, type]);


  return (
    <form method="POST" className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Add a new student"
          : "Add student Information"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        authentication Information
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
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
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Student Information
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-7">
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
            hidden
          />
        )}
        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Parent</label>
          <select defaultValue={""} id="grades" {...register("parentId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a parent</option>
            {relatedData?.parents?.map((parent: any) => (
              <option key={parent.id} value={parent.id} >
                {parent.name + " " + parent.surname}
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="text-red-500">{errors.parentId.message}</p>
          )}
        </div>
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
            defaultValue=""
          >
            <option value="" defaultValue={""} disabled>Gender</option>
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
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Student Grade</label>
          <select id="grades" defaultValue={""} {...register("gradeId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
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

        <div>
          <label htmlFor="grades" className="block mb-2 text-xs text-gray-500 ">Student class</label>
          <select defaultValue={""} id="grades" {...register("classId")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5" >
            <option value="" disabled>Choose a grade</option>
            {relatedData?.classes?.map((cls: any) => (
              <option key={cls.id} value={cls.id} >
                {cls.name}
              </option>
            ))}
          </select>
          {errors.gradeId && (
            <p className="text-red-500">{errors.gradeId.message}</p>
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
      {/* {errors && (
        <p className="text-xs text-red-400">{JSON.stringify(errors)}</p>
      )} */}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
