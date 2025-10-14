import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { getCurrentUserAndRole } from "@/lib/utils";
import Image from "next/image";;

type ResultList = Prisma.ResultGetPayload<{
  include: {
    student: {
      select: {
        name: true;
        surname: true;
      };
    };
    exam: {
      select: {
        startTime: true;
        lesson: {
          select: {
            subject: {
              select: {
                name: true;
              };
            };
            teacher: {
              select: {
                name: true;
                surname: true;
              };
            };
            class: {
              select: {
                name: true;
              };
            };
          };
        };
      }
    }

    assignment: {
      select: {
        startDate: true;
        lesson: {
          select: {
            subject: {
              select: {
                name: true;
              };
            };
            teacher: {
              select: {
                name: true;
                surname: true;
              };
            };
            class: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    }
  };
}>;


type Results = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  score: number;
  className: string;
  startTime: Date;
};





const renderRow = async (item: ResultList) => {
  const { role, currentUserId } = await getCurrentUserAndRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-uiPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item?.assignment?.lesson.subject.name ?? item.exam?.lesson.subject.name}</td>
      <td className="hidden md:table-cell">
        {item?.student?.name + " " + item?.student?.surname}
      </td>
      <td className="hidden md:table-cell">{item?.score}</td>
      <td className="hidden md:table-cell">{item.assignment ? item?.assignment?.lesson.teacher.name + " " + item?.assignment?.lesson.teacher.surname : item?.exam?.lesson.teacher.name + " " + item?.exam?.lesson.teacher.surname}</td>
      <td className="hidden md:table-cell">{item?.assignment ? item?.assignment?.lesson.class.name : item?.exam?.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {new Date(item?.exam?.startTime ?? item?.assignment?.startDate ?? Date.now()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="result" type="update" data={item} />
              <FormContainer table="result" type="delete" id={item?.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  )
};
const ResultListPage = async ({
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
      header: "title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
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

  const query: Prisma.ResultWhereInput = {};

  if (queryPerams) {
    for (const [key, value] of Object.entries(queryPerams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "classId":
            query.assignment = {
              lesson: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.OR = [
              {
                assignment: {
                  lesson: {
                    subject: {
                      name: {
                        contains: value,
                      },
                    },
                  },
                },
              },
              {
                exam: {
                  lesson: {
                    subject: {
                      name: {
                        contains: value,
                      },
                    },
                  },
                },
              },
              {
                student: {
                  OR: [
                    {
                      name: { contains: value },
                    },
                    {
                      surname: { contains: value },
                    },
                    {},
                  ],
                },
              },
              {
                assignment: {
                  lesson: {
                    teacher: {
                      OR: [
                        {
                          name: { contains: value },
                        },
                        {
                          surname: { contains: value },
                        },
                      ],
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

  //   WHERE CLAUSE BASED ON  URLS PARAMS

  switch (role) {
    case "student":
      query.studentId = currentUserId!;
      break;
    case "teacher":
      query.OR = [
        {
          assignment: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
        },
        {
          exam: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
        },
      ];
      break;
    case "parent":
      query.student = {
        parent: {
          id: currentUserId!,
        },
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.result.findMany({
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        assignment: {
          select: {
            startDate: true,
            lesson: {
              select: {
                subject: {
                  select: {
                    name: true,
                  },
                },
                teacher: {
                  select: {
                    name: true,
                    surname: true,
                  },
                },
                class: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        exam: {
          select: {
            startTime: true,
            lesson: {
              select: {
                subject: {
                  select: {
                    name: true,
                  },
                },
                teacher: {
                  select: {
                    name: true,
                    surname: true,
                  },
                },
                class: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        id: "desc",
      }
    }),
    prisma.result.count({
      where: query,
    }),
  ]);
  // console.log(data);

  const results = data.map((item) => {
    const assessment = item.assignment || item.exam;
    if (!assessment) return null;
    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.lesson.subject.name,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName:
        assessment.lesson.teacher.name +
        " " +
        assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : item.assignment?.startDate,
    };
  });
  // console.log(results);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
              <FormContainer table="result" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ResultListPage;
