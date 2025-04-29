import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { PAGE } from "@/lib/setting";



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
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = async (student:any) => (
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
        <p className="text-xs text-gray-500">{student.class?.name}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{student.surname}</td>
    <td className="hidden md:table-cell">{student.class?.name}</td>
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
          // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-uiPurple">
          //   <Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          <FormModal table="student" type="delete" id={student.id} />
        )}
      </div>
    </td>
  </tr>
);
const StudentListPage =  async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {

  // const { page, ...queryPerams } = searchParams;

  // const p: number = typeof page === "string" ? parseInt(page) : 1;

  // const buildWhereClause = (
  //   queryPerams: { [key: string]: string },
  //   teacherLessonsId:string[] | []
    
  // ) => {
  //   const conditions: any[] = [];
  //   if (queryPerams) {
  //     for (const [key, value] of Object.entries(queryPerams)) {
  //       if (value !== undefined) {
  //         switch (key) {
  //           case "search":
  //             conditions.push(like(student.name, `%${value}%`));
  //             break;
  //             case "teacherId":
  //               conditions.push( inArray(lesson.teacherId, teacherLessonsId),)

  //         }
  //       }
  //     }
  //   }

  //   return conditions.length > 0 ? and(...conditions) : conditions[0];
  // };

  // const { students, total }: { students: StudentList[]; total: number } =
  //   await db.transaction(async (trx) => {
     
  //     let teacherLessonsId: string[] = []

      
      
  //     const studentClasses: ClassList[] = await trx.query.classSchema.findMany({
  //       with:{
  //         lessons: true,
  //         students: true
  //       }
  //     })

  //     if(queryPerams.teacherId) {
  //       teacherLessonsId = studentClasses.flatMap(classItem => 
  //         classItem.lessons?.filter(lesson => lesson.teacherId === queryPerams.teacherId)
  //         .map(lesson => lesson.teacherId) || []
  //       );
  //     }


  //     const whereClause = buildWhereClause(queryPerams, teacherLessonsId);

  //     console.log(teacherLessonsId);
      

  //     const students = await trx.query.student.findMany({
  //       with: {
  //         class: {
  //         with: {
  //             lessons: 
  //             {
  //               where: whereClause,
  //               with: {
  //                 teacher: true,
  //               },
  //             }
  //           },
  //         },
  //       },

  //       where: whereClause,
  //       limit: PAGE,
  //       offset: (p - 1) * PAGE,
  //     });
  //     let total = 0;

  //     const totalResult = await trx
  //       .select({
  //         count: count(),
  //       })
  //       .from(student)

  //       .where(whereClause)
  //     total = totalResult[0]?.count ?? 0;

  //     return {
  //       students: students,
  //       total: total,
  //     };

  //   });
  //   console.log({students},{queryPerams},{total});
    



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
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-uiYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={studentsData} />
      {/* PAGINATION
      <Pagination page={p} count={total} /> */}
    </div>
  );
};

export default StudentListPage;
