import { PrismaClient, Day, UserSex } from '../src/generated/prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grades.create({
      data: {
        level: i,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `Teacher ${i}`,
        surname: `Surname ${i}`,
        email: `teacher${i}@school.edu`,
        phone: `123-456-${7000 + i}`,
        address: `${i} Teacher Street, Education City`,
        bloodType: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][i % 8],
        sex: i % 2 === 0 ? UserSex.Male : UserSex.Famale,
        birthday: new Date(1970 + (i % 30), (i % 12), (i % 28) + 1),
        subjects: {
          connect: [
            { id: (i % 10) + 1 },
            { id: ((i + 3) % 10) + 1 } // Connect to a second subject
          ]
        },
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    const classLetter = ["A", "B", "C"][i % 3];
    const gradeLevel = Math.ceil(i / 3);

    await prisma.class.create({
      data: {
        name: `${gradeLevel}${classLetter}`,
        gradeId: gradeLevel,
        capacity: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
        supervisorId: `teacher${i}`,
      },
    });
  }

  // Update teachers with their class connections
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.update({
      where: { id: `teacher${i}` },
      data: {
        classes: {
          connect: [{ id: (i % 6) + 1 }]
        },
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 40; i++) {
    await prisma.parent.create({
      data: {
        id: `parent${i}`,
        username: `parent${i}`,
        name: `Parent ${i}`,
        surname: `Family ${Math.ceil(i / 2)}`,
        email: `parent${i}@example.com`,
        phone: `987-555-${4000 + i}`,
        address: `${Math.ceil(i / 2)} Family Avenue, School District`,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 120; i++) {
    const classId = (i % 6) + 1;
    const gradeId = Math.ceil(classId / 3);
    const parentIndex = Math.floor(i / 3) % 40 + 1;

    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: `Student ${i}`,
        surname: `Family ${Math.ceil(parentIndex / 2)}`,
        email: `student${i}@school.edu`,
        phone: `987-123-${1000 + i}`,
        address: `${Math.ceil(parentIndex / 2)} Family Avenue, School District`,
        bloodType: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][i % 8],
        sex: i % 2 === 0 ? UserSex.Male : UserSex.Famale,
        parentId: `parent${parentIndex}`,
        gradeId: gradeId,
        classId: classId,
        birthday: new Date(2010 - (i % 6), (i % 12), (i % 28) + 1),
      },
    });
  }

  // LESSON
  const weekdays = [
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
  ];

  for (let i = 1; i <= 60; i++) {
    // Your original logic for IDs:
    const subjectId = (i % 10) + 1;
    const classId = (i % 6) + 1;
    const teacherId = `teacher${(i % 15) + 1}`;
    const dayIndex = (i - 1) % weekdays.length;
    const selectedDay = weekdays[dayIndex];


    let startHour = 8 + (Math.floor(i / 10) % 7);

    const lessonsPerDay = 60 / weekdays.length;
    const lessonIndexInDay = (i - 1) % lessonsPerDay;
    startHour = 8 + Math.floor(lessonIndexInDay / Math.max(1, Math.floor(lessonsPerDay / 8)));
    startHour = Math.min(15, Math.max(8, startHour));

    const subjectName = subjectData[subjectId - 1]
      ? subjectData[subjectId - 1].name
      : `Unknown Subject ${subjectId}`;

    try {
      await prisma.lesson.create({
        data: {
          name: `${subjectName} Class ${classId}`,
          day: selectedDay,
          start: new Date(2023, 0, 1, startHour, 0, 0),
          end: new Date(2023, 0, 1, startHour + 1, 0, 0),
          subjectId: subjectId,
          classId: classId,
          teacherId: teacherId,
        },
      });
    } catch (error) {
      console.error(`Failed to create lesson for i=${i}:`, error);
      console.error(`Details: SubjectID=${subjectId}, ClassID=${classId}, TeacherID=${teacherId}, Day=${selectedDay}, StartHour=${startHour}`);
    }
  }


  // EXAM
  for (let i = 1; i <= 20; i++) {
    const lessonId = (i % 60) + 1;
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + (i * 2)); // Spread exams over time

    const startTime = new Date(examDate);
    startTime.setHours(9, 0, 0);

    const endTime = new Date(examDate);
    endTime.setHours(10, 30, 0);

    await prisma.exam.create({
      data: {
        title: `Exam ${i} - ${subjectData[i % 10].name}`,
        startTime: startTime,
        endTime: endTime,
        lessonId: lessonId,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 30; i++) {
    const lessonId = (i % 60) + 1;
    const startDate = new Date();
    startDate.setDate(startDate.getDate());

    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 7); // One week to complete assignments

    await prisma.assignment.create({
      data: {
        title: `Assignment ${i} - ${subjectData[i % 10].name}`,
        startDate: startDate,
        dueDate: dueDate,
        lessonId: lessonId,
      },
    });
  }

  // RESULT - For Exams
  for (let i = 1; i <= 50; i++) {
    const studentId = `student${i}`;
    const examId = (i % 20) + 1;

    await prisma.result.create({
      data: {
        score: 60 + Math.floor(Math.random() * 41), // Scores between 60-100
        studentId: studentId,
        examId: examId,
      },
    });
  }

  // RESULT - For Assignments
  for (let i = 1; i <= 50; i++) {
    const studentId = `student${(i + 30) % 120 + 1}`;
    const assignmentId = (i % 30) + 1;

    await prisma.result.create({
      data: {
        score: 70 + Math.floor(Math.random() * 31), // Scores between 70-100
        studentId: studentId,
        assignmentId: assignmentId,
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 200; i++) {
    const studentId = `student${(i % 120) + 1}`;
    const lessonId = (i % 60) + 1;
    const attendanceDate = new Date();
    attendanceDate.setDate(attendanceDate.getDate() - (i % 14)); // Last two weeks

    await prisma.attendance.create({
      data: {
        date: attendanceDate,
        present: Math.random() > 0.1, // 90% chance of being present
        studentId: studentId,
        lessonId: lessonId,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 12; i++) {
    const classId = i <= 6 ? i : null; // Some events for specific classes, some for all
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + i * 3);
    startTime.setHours(13, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(15, 0, 0);

    const eventTypes = [
      "Sports Day",
      "Science Fair",
      "Parent-Teacher Meeting",
      "Art Exhibition",
      "Music Concert",
      "Field Trip",
    ];

    await prisma.event.create({
      data: {
        title: `${eventTypes[i % eventTypes.length]} ${i}`,
        description: `Join us for the ${eventTypes[i % eventTypes.length]}. All students ${classId ? `from class ${classId}` : ''} are welcome!`,
        startTime: startTime,
        endTime: endTime,
        classId: classId,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 15; i++) {
    const classId = i <= 6 ? i : null; // Some announcements for specific classes, some for all
    const announcementDate = new Date();
    announcementDate.setDate(announcementDate.getDate() - (i % 10));

    const announcementTypes = [
      "Schedule Change",
      "Upcoming Test",
      "Holiday Reminder",
      "New School Policy",
      "Extracurricular Activity",
    ];

    await prisma.announcement.create({
      data: {
        title: `${announcementTypes[i % announcementTypes.length]} - Announcement ${i}`,
        description: `Important notice regarding ${announcementTypes[i % announcementTypes.length].toLowerCase()}. ${classId ? `This applies to class ${classId} only.` : 'This applies to all classes.'}`,
        date: announcementDate,
        classId: classId,
      },
    });
  }

  console.log("Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });