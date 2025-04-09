import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export  * from './parent/admin/adminSchema';
export  * from './parent/parentSchema';
export  * from './student/studentSchema';
export *  from "./teacher/TeacherSchema";
export *  from "./joins/teacherToSubject";
// export *  from "./lesson/lessonSchema";
export *  from "./subject/subjectSchema";


