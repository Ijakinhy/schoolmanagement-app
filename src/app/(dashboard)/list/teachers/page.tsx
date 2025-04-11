import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { db } from "../../../../../drizzle/db";
import {
  lesson,
  type Class,
  type Lesson,
  type Subject,
  type Teacher,
  type TeacherList,
} from "../../../../../drizzle/schema";
import { teacher } from "../../../../../drizzle/schema";
import { ITEM_PER_PAGE, PAGE } from "@/lib/setting";
import { count, inArray } from "drizzle-orm";

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

type Teacher1 = Teacher & { subjects: Subject[] } & { lessons: Lesson[] } & {
  supervisor: Class[];
};
type Operator = {
  inArray: typeof inArray;
};

const renderRow = (item: TeacherList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-uiPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={
          item.image ||
          "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
        }
        alt=""
        width={40}
        height={40}
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">
      {item.subjects.map((subject) => subject.subject.name).join(",")}
    </td>
    <td className="hidden md:table-cell">
      {item.classes.map((className) => className.name).join(",")}
    </td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-uiSky">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
          <>
            {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-uiPurple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button> */}

            <FormModal table="teacher" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

export async function TeacherListPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const { page, ...queryPerams } = searchParams;

  const p: number = typeof page === "string" ? parseInt(page) : 1;

  const buildeWhereClause = (
    queryPerams: { [key: string]: string },
    teacherIds: string[]
  ) => {
    return (teacher: any, { inArray }: Operator) => {
      if (queryPerams) {
        for (const [key, value] of Object.entries(queryPerams)) {
          if(value !== undefined ) {
            switch (key) {
              case "classId":
                return inArray(teacher.id, teacherIds);
            }
          }
        }
      }
    };
  };

  const { teachers, total }: { teachers: TeacherList[]; total: number } =
    await db.transaction(async (trx) => {
      let teacherIds: string[] = [];
      if (queryPerams.classId) {
        const lessonTeachers = await trx.query.lesson.findMany({
          where: (lesson, { eq }) =>
            eq(lesson.classId, parseInt(queryPerams.classId)),
          with: {
            teacher: true,
          },
        });

        teacherIds = lessonTeachers.map((lesson) => lesson.teacherId);
      }

      const whereClause = buildeWhereClause(queryPerams, teacherIds);

      const teachers = await trx.query.teacher.findMany({
        with: {
          subjects: {
            with: {
              subject: true,
            },
          },
          lessons: true,
          classes: true,
        },
        where: whereClause,

        limit: PAGE,
        offset: (p - 1) * PAGE,
      });
      let total = 0;
      if (queryPerams.classId) {
        const totalResult = await trx
          .select({
            count: count(),
          })
          .from(teacher)
          .where(inArray(teacher.id, teacherIds));
        total = totalResult[0]?.count ?? 0;
      }
      const totalResult = await trx
        .select({
          count: count(),
        })
        .from(teacher)
        .where(() => {
          if (queryPerams) {
            for (const [key, value] of Object.entries(queryPerams)) {
              if (value !== undefined) {
                switch (key) {
                  case "classId":
                    return inArray(teacher.id, teacherIds);
                }
              }
            }
          }
        });

      total = totalResult[0]?.count ?? 0;

      return {
        teachers,
        total: total,
      };
    });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-uiYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-uiYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-uiYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <>
                <FormModal table="teacher" type="create" />
              </>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachers} />
      {/* PAGINATION */}
      <Pagination page={p} count={total} />
    </div>
  );
}

export default TeacherListPage;
