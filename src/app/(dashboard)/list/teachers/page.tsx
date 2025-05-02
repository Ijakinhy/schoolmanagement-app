import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE, PAGE } from "@/lib/setting";
import { Class, Lesson, Prisma, Subject, Teacher } from "@/generated/prisma";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";



const user = await currentUser()
const role =  (user?.publicMetadata as {role: string}).role

type TeacherList = Teacher & {
  subjects: Subject[];
  lessons: Lesson[];
  classes: Class[];
};

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
      {item.subjects.map((subject) => subject.name).join(",")}
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

 const  TeacherListPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {
  const { page, ...queryPerams } = searchParams;

  const p: number = typeof page === "string" ? parseInt(page) : 1;

  // WHERE CLAUSE BASED ON  URLS PARAMS

  const query: Prisma.TeacherWhereInput = {};

  if (queryPerams) {
    for (const [key, value] of Object.entries(queryPerams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value as string),
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

  const [teachers, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      include: {
        classes: true,
        subjects: true,
        lessons: true,
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({
      where: query,
    }),
  ]);

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
      <Pagination page={p} count={count} />
    </div>
  );
}

export default TeacherListPage;
