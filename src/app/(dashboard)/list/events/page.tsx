import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { getCurrentUserAndRole } from "@/lib/utils";

import Image from "next/image";

type EventList = Prisma.EventGetPayload<{
  include: {
    class: {
      select: {
        name: true;
      };
    };
  };
}>;

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
  {
    header: "Start Time",
    accessor: "startTime",
    className: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "endTime",
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

const renderRow = (item: EventList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class?.name || '-'}</td>
    <td className="hidden md:table-cell">
      {new Date(item.startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </td>
    <td className="hidden md:table-cell">
      {new Date(item.startTime).toLocaleDateString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </td>
    <td className="hidden md:table-cell">
      {new Date(item.endTime).toLocaleDateString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            <FormModal table="event" type="update" data={item} />
            <FormModal table="event" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const EventListPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {
  const { page, ...queryPerams } = searchParams;

  const p: number = typeof page === "string" ? parseInt(page) : 1;

  // WHERE CLAUSE BASED ON  URLS PARAMS

  const query: Prisma.EventWhereInput = {};

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

  //  ROLE WHERE CONDITION

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  };

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ];



  const [events, count] = await prisma.$transaction([
    prisma.event.findMany({
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
    }),
    prisma.event.count({
      where: query,
    }),
  ]);



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={events} />
      {/* PAGINATION */}
      <Pagination count={count} page={p} />
    </div>
  );
};

export default EventListPage;
