"use client";

import { deleteAnnouncement, deleteAssignment, deleteAttendance, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteResult, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});

type Forms = {
  [key: string]: (type: "create" | "update", data?: any, relatedData?: Record<string, any>) => JSX.Element;
};



const forms: Forms = {
  teacher: (type, data, relatedData) => <TeacherForm type={type} data={data} relatedData={relatedData} />,
  student: (type, data, relatedData) => <StudentForm type={type} data={data} relatedData={relatedData} />,
  parent: (type, data, relatedData) => <ParentForm type={type} data={data} relatedData={relatedData} />,
  subject: (type, data, relatedData) => <SubjectForm type={type} data={data} relatedData={relatedData} />,
  class: (type, data, relatedData) => <ClassForm type={type} data={data} relatedData={relatedData} />,
  lesson: (type, data, relatedData) => <LessonForm type={type} data={data} relatedData={relatedData} />,
  exam: (type, data, relatedData) => <ExamForm type={type} data={data} relatedData={relatedData} />,
  assignment: (type, data, relatedData) => <AssignmentForm type={type} data={data} relatedData={relatedData} />,
  result: (type, data, relatedData) => <ResultForm type={type} data={data} relatedData={relatedData} />,
  attendance: (type, data, relatedData) => <AttendanceForm type={type} data={data} relatedData={relatedData} />,
  event: (type, data, relatedData) => <EventForm type={type} data={data} relatedData={relatedData} />,
  announcement: (type, data, relatedData) => <AnnouncementForm type={type} relatedData={relatedData} data={data} />,
};


const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData
}: FormContainerProps & { relatedData?: Record<string, any> }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-uiYellow"
      : type === "update"
        ? table === "teacher" || table === "student"
          ? "bg-uiYellow"
          : "bg-uiSky"
        : "bg-uiPurple";

  // const bgColor = type === "create" ? "bg-uiYellow" : "bg-uiYellow";

  const [open, setOpen] = useState(false);
  type DeleteActions = {
    [key in ("teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "assignment" | "result" | "attendance" | "event" | "announcement")]: (currentState: { success: boolean; error: boolean; }, data: FormData) => Promise<{ success: boolean; error: boolean; }>;
  }

  const deleteActionsMap: DeleteActions = {
    teacher: deleteTeacher,
    student: deleteStudent,
    parent: deleteParent,
    class: deleteClass,
    lesson: deleteLesson,
    exam: deleteExam,
    assignment: deleteAssignment,
    result: deleteResult,
    attendance: deleteAttendance,
    event: deleteEvent,
    announcement: deleteAnnouncement,
    subject: deleteSubject
  };
  const [formState, formAction] = useFormState(deleteActionsMap[table], { success: false, error: false })


  const router = useRouter()
  useEffect(() => {
    if (formState.success) {
      toast(`${table} deleted successfully`)
      setOpen(false)
      router.refresh()
    }

  }, [formState])

  const renderForm = useCallback(() => {

    if (type === "delete" && id) {
      return (
        <form action={formAction} className="p-4 flex flex-col gap-4 bg-ui">
          <input type="text | number" readOnly name="id" value={id as string | number} className="hidden" />
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    }

    if (type === "create" || type === "update") {
      return forms[table](type, data, relatedData);
    }

    return "Form not found!";
  }, [type, id, table, data]);

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt={type} width={16} height={16} />
      </button>
      {open && (
        <div className="w-full h-full overflow-y-hidden fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {renderForm()}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(FormModal);
