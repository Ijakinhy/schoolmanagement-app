import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { getCurrentUserAndRole } from "@/lib/utils";
import Image from "next/image";

type AttendanceList = Prisma.AttendanceGetPayload<{
    include: {
        student: true;
        lesson: {
            include: {
                subject: true;
                teacher: true;
                class: true;
            };
        };
    };
}>;


const renderRow = async (item: AttendanceList) => {
    const { role, currentUserId } = await getCurrentUserAndRole();


    return (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-uiPurpleLight"
        >
            <td className="">{item.student.name + " " + item.student.surname}</td>
            <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
            <td>{item.lesson.class.name}</td>
            <td className="hidden md:table-cell">{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</td>
            <td className="hidden md:table-cell">
                {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}
            </td>
            <td className="">{item.present ? "Present" : "absent"}</td>
            <td>
                <div className="flex items-center gap-2">
                    {(role === "admin" || role === "teacher") && (
                        <>
                            <FormContainer table="attendance" type="update" data={item} />
                            <FormContainer table="attendance" type="delete" id={item.id} />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
};
const AttendanceListPage = async ({
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
            header: "student Name",
            accessor: "name",
        },
        {
            header: "Subject Name",
            accessor: "subject",
        },
        {
            header: "Class",
            accessor: "class",
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell",
        },
        {
            header: "Date",
            accessor: "dueDate",
            className: "hidden md:table-cell",
        },
        {
            header: "Present",
            accessor: "present",
            className: "hidden md:table-cell",
        },
        ...(role === "admin" || role === "teacher" ? [{
            header: "Actions",
            accessor: "action",
        }] : []),
    ];
    const p: number = typeof page === "string" ? parseInt(page) : 1;

    // WHERE CLAUSE BASED ON  URLS PARAMS

    const query: Prisma.AttendanceWhereInput = {};
    query.lesson = {}

    if (queryPerams) {
        for (const [key, value] of Object.entries(queryPerams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.lesson.teacherId = value

                        break;
                    case "classId":
                        query.lesson.classId = parseInt(value)
                    case "search":
                        query.OR = [
                            {
                                lesson: {
                                    subject: {
                                        name: {
                                            contains: value,
                                        },
                                    },
                                },
                            },
                            {
                                lesson: {
                                    teacher: {
                                        name: {
                                            contains: value,
                                        },
                                    },
                                },
                            },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // WHERE CLAUSE BASED ON  ROLE

    switch (role) {
        case "teacher":
            query.lesson.teacherId = currentUserId!
            break;
        case "student":
            query.lesson = {
                class: {
                    students: {
                        some: {
                            id: currentUserId!,
                        },
                    },
                },
            }
            break;
        case "parent":
            query.lesson = {
                class: {
                    students: {
                        some: {
                            parentId: currentUserId!,
                        },
                    },
                },
            }
        case "admin":
            break;
        default:
            break;
    }

    // GET DATA FROM DATABASE

    const [attendances, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            include: {
                student: true,
                // teacher:{select:{name:true,surname:true}},
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surname: true } },
                        class: { select: { name: true } },
                    }
                }
            },
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: {
                id: "desc",
            }
        }),
        prisma.attendance.count({
            where: query,
        }),
    ]);
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Attendances
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
                        {(role === "admin" || role === "teacher") && (
                            <FormContainer table="attendance" type="create" />

                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={attendances} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default AttendanceListPage;
