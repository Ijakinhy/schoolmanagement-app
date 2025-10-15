import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE, PAGE } from "@/lib/setting";
import {
  Attendance,
  Class,
  Grades,
  Parent,
  Prisma,
  Result,
  Student,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getCurrentUserAndRole } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type StudentList = Student & {
  grades: Grades[];
  class: Class;
  attendance: Attendance[];
  results: Result[];
  parent: Parent[];
};

const renderRow = async (student: StudentList) => {
  const { role } = await getCurrentUserAndRole();

  return (
    <tr
      key={student.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-uiPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={student.image || "/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{student.name}</h3>
          <p className="text-xs text-gray-500">{student.class.name[0]}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{student.surname}</td>
      <td className="hidden md:table-cell">{student.class?.name[0]}</td>
      <td className="hidden md:table-cell">{student.phone}</td>
      <td className="hidden md:table-cell">{student.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${student.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-uiSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormContainer table="student" type="delete" id={student.id} />
          )}
        </div>
      </td>
    </tr>
  )
};
const StudentListPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {
  const { page, ...queryPerams } = searchParams;
  const { role, currentUserId } = await getCurrentUserAndRole();
  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
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
    ...(role === "admin"
      ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
      : []),
  ];
  const p: number = typeof page === "string" ? parseInt(page) : 1;

  // WHERE CLAUSE BASED ON  URLS PARAMS

  const query: Prisma.StudentWhereInput = {};

  if (queryPerams) {
    for (const [key, value] of Object.entries(queryPerams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value,
                },
              },
            };
            break;
          case "search":
            query.name = { contains: value };
            break;
          default:
            break;
        }
      }
    }
  }

  const [students, count] = await prisma.$transaction([
    prisma.student.findMany({
      include: {
        // parent:true,
        class: true,
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        createdAt: "desc",
      }
    }),
    prisma.student.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
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
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={students} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
