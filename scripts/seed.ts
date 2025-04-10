import mysql from 'mysql2/promise';
import { db } from "../drizzle/db.js";
import * as schema from "../drizzle/schema/index.js"; 
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/mysql2';

// Helper function to generate random date within a range
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
 

  const connection =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'jakin', 
    database: 'schoolmanagement',
    port: 3306,  
  });

 
  const db = drizzle(connection, { schema, mode: "default" });



  // Clear existing data if needed (optional)
  // You might want to delete data in the reverse order of dependencies
  try {
    console.log("Cleaning up existing data...");
    // Delete in order of dependencies
    await db.delete(schema.announcement);
    await db.delete(schema.event);
    await db.delete(schema.attendance);
    await db.delete(schema.result);
    await db.delete(schema.assignment);
    await db.delete(schema.exam);
    await db.delete(schema.lesson);
    await db.delete(schema.student);
    await db.delete(schema.parent);
    await db.delete(schema.teacherToSubject);
    await db.delete(schema.teacher);
    await db.delete(schema.classSchema);
    await db.delete(schema.subject);
    await db.delete(schema.grade);
    await db.delete(schema.admin);
    console.log("Existing data cleared successfully.");
  } catch (error) {
    console.warn("Error clearing existing data:", error);
    // Continue with seeding anyway
  }

  console.log("Starting database seeding...");

  // ADMIN
  console.log("Seeding admins...");
  await db.insert(schema.admin).values([
    {
      id: "admin1",
      username: "admin1",
    },
    {
      id: "admin2",
      username: "admin2",
    },
  ]);

  // GRADE
  console.log("Seeding grades...");
  for (let i = 1; i <= 6; i++) {
    await db.insert(schema.grade).values({
      level: i,
    });
  }

  // CLASS
  console.log("Seeding classes...");
  for (let i = 1; i <= 6; i++) {
    await db.insert(schema.classSchema).values({
      name: `${i}A`,
      gradeId: i,
      capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
    });
  }

  // SUBJECT
  console.log("Seeding subjects...");
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

  await db.insert(schema.subject).values(subjectData);

  // PARENT
  console.log("Seeding parents...");
  for (let i = 1; i <= 25; i++) {
    await db.insert(schema.parent).values({
      id: `parentId${i}`,
      username: `parentId${i}`,
      name: `PName ${i}`,
      surname: `PSurname ${i}`,
      email: `parent${i}@example.com`,
      phone: `123-456-789${i}`,
      address: `Address${i}`,
      createdAt: new Date(),
    });
  }

  // TEACHER
  console.log("Seeding teachers...");
  for (let i = 1; i <= 15; i++) {
    const birthday = randomDate(
      new Date(new Date().setFullYear(new Date().getFullYear() - 60)),
      new Date(new Date().setFullYear(new Date().getFullYear() - 30))
    );

    // First create the teacher
    await db.insert(schema.teacher).values({
      id: `teacher${i}`,
      username: `teacher${i}`,
      name: `TName${i}`,
      surname: `TSurname${i}`,
      email: `teacher${i}@example.com`,
      phone: `123-456-789${i}`,
      address: `Address${i}`,
      bloodType: "A+",
      sex: i % 2 === 0 ? "male" : "female",
      createdAt: new Date(),
    });
  }

  // Set up teacher-subject relationships
  console.log("Setting up teacher-subject relationships...");
  for (let i = 1; i <= 15; i++) {
    const subjectId = (i % 10) + 1;
    await db.insert(schema.teacherToSubject).values({
      teacherId: `teacher${i}`,
      subjectId: subjectId,
    });
  }

  // Set up teacher-class relationships
  console.log("Setting up teacher-class relationships...");
  for (let i = 1; i <= 15; i++) {
    // Optionally set one teacher as supervisor for each class
    if (i <= 6) {
      await db
        .update(schema.classSchema)
        .set({ supervisorId: `teacher${i}` })
        .where(eq(schema.classSchema.id, 1));
    }
  }

  // STUDENT
  console.log("Seeding students...");
  for (let i = 1; i <= 50; i++) {
    const birthday = randomDate(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      new Date(new Date().setFullYear(new Date().getFullYear() - 5))
    );

    await db.insert(schema.student).values({
      id: `student${i}`,
      username: `student${i}`,
      name: `SName${i}`,
      surname: `SSurname ${i}`,
      email: `student${i}@example.com`,
      phone: `987-654-321${i}`,
      address: `Address${i}`,
      bloodType: "O-",
      sex: i % 2 === 0 ? "male" : "female",
      parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
      gradeId: (i % 6) + 1,
      classId: (i % 6) + 1,
      createdAt: new Date(),
    });
  }

  // LESSON
  console.log("Seeding lessons...");
  const days: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  for (let i = 1; i <= 30; i++) {
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const startHour = 8 + Math.floor(Math.random() * 8); // Classes between 8 AM and 4 PM

    const startTime = new Date();
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // 1 hour classes

    await db.insert(schema.lesson).values({
      name: `Lesson${i}`,
      day: randomDay,
      startTime: startTime,
      endTime: endTime,
      subjectId: (i % 10) + 1,
      classId: (i % 6) + 1,
      teacherId: `teacher${(i % 15) + 1}`,
    });
  }

  // EXAM
  console.log("Seeding exams...");
  for (let i = 1; i <= 10; i++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + i);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 2);

    await db.insert(schema.exam).values({
      title: `Exam ${i}`,
      start: startTime,
      end: endTime,
      lessonId: (i % 30) + 1,
    });
  }

  // ASSIGNMENT
  console.log("Seeding assignments...");
  for (let i = 1; i <= 10; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);

    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 7); // Due in a week

    await db.insert(schema.assignment).values({
      title: `Assignment ${i}`,
      startDate: startDate,
      dueDate: dueDate,
      lessonId: (i % 30) + 1,
    });
  }

  // RESULT
  console.log("Seeding results...");
  for (let i = 1; i <= 10; i++) {
    await db.insert(schema.result).values({
      score: Math.floor(Math.random() * 41) + 60, // Score between 60-100
      studentId: `student${i}`,
      examId: i <= 5 ? i : null,
      assignmentId: i > 5 ? i - 5 : null,
    });
  }

  // ATTENDANCE
  console.log("Seeding attendance records...");
  for (let i = 1; i <= 10; i++) {
    await db.insert(schema.attendance).values({
      date: new Date(),
      present: Math.random() > 0.2, // 80% chance of being present
      studentId: `student${i}`,
      lessonId: (i % 30) + 1,
    });
  }

  // EVENT
  console.log("Seeding events...");
  for (let i = 1; i <= 5; i++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + i * 2);
    startTime.setHours(13, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 3);

    await db.insert(schema.event).values({
      title: `Event ${i}`,
      description: `Description for Event ${i}`,
      startDate: startTime,
      endDate: endTime,
      classId: (i % 5) + 1,
    });
  }

  // ANNOUNCEMENT
  console.log("Seeding announcements...");
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i); // Past announcements

    await db.insert(schema.announcement).values({
      title: `Announcement ${i}`,
      description: `Description for Announcement ${i}`,
      date: date,
      classId: (i % 5) + 1,
    });
  }

  console.log("Seeding completed successfully.");

  // // Close the connection
  await connection.end();
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
