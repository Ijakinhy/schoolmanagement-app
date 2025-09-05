import { role } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/utils";

const Announcements = async() => {


  const roleConditions= {
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  }
  
  const announcements =await prisma.announcement.findMany({
    orderBy:{date:"desc"},
    take: 4,
    where: {
      OR: [
        {
          classId: null,
        },
        {
          class: roleConditions[role as keyof typeof roleConditions] || {} ,
        }
        
      ]
    }
  })

  const bgColors =["bg-uiSky","bg-uiPurple","bg-uiYellow","bg-uiPurpleLight","bg-uiYellowLight","bg-uiSkyLight",]


  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {announcements.map((announcement,index) => (
          <div className={`${bgColors[index % bgColors.length]}  rounded-md p-4`} key={announcement.id}>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{announcement.title}</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {announcement.date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
           {announcement.description}
          </p>
        </div>
        ))}
        
       
      </div>
    </div>
  );
};

export default Announcements;
