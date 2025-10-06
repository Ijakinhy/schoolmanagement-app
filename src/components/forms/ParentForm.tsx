"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { parentSchema, ParentSchema } from "@/lib/datasource";
import MultiSelect from "../selectInput/SelectInput";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { createUpdateParent, createUpdateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";



const ParentForm = ({
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
    control,
    formState: { errors },
    reset
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [state, formAction] = useFormState(createUpdateParent, {
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
          ? "Add new parent"
          : "Edit parent information"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication  Information
      </span>
      <div className="grid grifid-cols-1 sm:grid-cols-2  gap-7">
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
        Personal  Information
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
          <MultiSelect
            name="students"
            control={control}
            defaultValue={data?.students?.map((student: any) => student.id) || []}
            options={relatedData?.students.map((student: any) => ({
              label: `${student.name} ${student.surname}`,
              value: student.id,
            })) || []}
            label="Students"
            placeholder="Choose student"
            className="mb-4"
          />
          {errors.students?.message && (
            <p className="text-xs text-red-400">
              {errors.students.message.toString()}
            </p>
          )}
        </div>
      </div>
      {errors && (
        <p className="text-xs text-red-400">{JSON.stringify(errors)}</p>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
