import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { getCurrentUserAndRole } from "@/lib/utils";
import Image from "next/image";

type AnnouncementList = Prisma.AnnouncementGetPayload<{
  include: {
    class: {
      select: {
        name: true;
      };
    };
  };
}>;


const renderRow = async (item: AnnouncementList) => {
  const { role, currentUserId } = await getCurrentUserAndRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-uiPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.class?.name || "general"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(item.date))}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="announcement" type="update" data={item} />
              <FormContainer table="announcement" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
const AnnouncementListPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {
  const { page, ...queryPerams } = searchParams;
  const p: number = typeof page === "string" ? parseInt(page) : 1;
  const { role, currentUserId } = await getCurrentUserAndRole();
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
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


  // WHERE CLAUSE BASED ON  URLS PARAMS

  const query: Prisma.AnnouncementWhereInput = {};
  query.class = {};

  if (queryPerams) {
    for (const [key, value] of Object.entries(queryPerams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value };
            break;
          default:
            break;
        }
      }
    }
  }

  // //  WHERE  CLAUSE BASED ON  THE ROLE

  const roleConditions: Record<string, Prisma.ClassWhereInput> = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ];

  // GET DATA
  const [announcements, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        date: "desc",
      }
    }),
    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
        </h1>
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
              <FormContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={announcements} />
      {/* PAGINATION */}
      <Pagination count={count} page={p} />
    </div>
  );
};

export default AnnouncementListPage;
