CREATE TABLE `admin` (
	`id` varchar(36) NOT NULL,
	`username` varchar(30),
	CONSTRAINT `admin_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `parent` (
	`id` varchar(36) NOT NULL,
	`username` varchar(30) NOT NULL,
	`name` varchar(30) NOT NULL,
	`surname` varchar(30) NOT NULL,
	`email` varchar(30),
	`phone` varchar(30) NOT NULL,
	`address` varchar(30) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `parent_id` PRIMARY KEY(`id`),
	CONSTRAINT `parent_username_unique` UNIQUE(`username`),
	CONSTRAINT `parent_email_unique` UNIQUE(`email`),
	CONSTRAINT `parent_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `student` (
	`id` varchar(36) NOT NULL,
	`username` varchar(30) NOT NULL,
	`surname` varchar(30) NOT NULL,
	`name` varchar(30) NOT NULL,
	`email` varchar(30),
	`phone` varchar(30),
	`address` varchar(30) NOT NULL,
	`bloodType` varchar(30) NOT NULL,
	`sex` enum('male','female') NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`img` varchar(30),
	`parentId` varchar(36) NOT NULL,
	`classId` int NOT NULL,
	`gradeId` int NOT NULL,
	CONSTRAINT `student_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_username_unique` UNIQUE(`username`),
	CONSTRAINT `student_email_unique` UNIQUE(`email`),
	CONSTRAINT `student_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `teacher` (
	`id` varchar(36) NOT NULL,
	`username` varchar(30) NOT NULL,
	`surname` varchar(30) NOT NULL,
	`name` varchar(30) NOT NULL,
	`email` varchar(30),
	`phone` varchar(30) NOT NULL,
	`address` varchar(30) NOT NULL,
	`blood_type` varchar(30) NOT NULL,
	`sex` enum('male','female') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`image` varchar(30),
	CONSTRAINT `teacher_id` PRIMARY KEY(`id`),
	CONSTRAINT `teacher_username_unique` UNIQUE(`username`),
	CONSTRAINT `teacher_email_unique` UNIQUE(`email`),
	CONSTRAINT `teacher_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `teacherToSubject` (
	`teacher_id` varchar(36) NOT NULL,
	`subject_id` int NOT NULL,
	CONSTRAINT `teacherToSubject_teacher_id_subject_id_pk` PRIMARY KEY(`teacher_id`,`subject_id`)
);
--> statement-breakpoint
CREATE TABLE `subject` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	CONSTRAINT `subject_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`day` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
	`startTime` datetime NOT NULL,
	`endTime` datetime NOT NULL,
	`subjectId` int NOT NULL,
	`teacherId` varchar(36) NOT NULL,
	`classId` int NOT NULL,
	CONSTRAINT `lesson_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` datetime NOT NULL,
	`present` boolean NOT NULL,
	`studentId` varchar(36) NOT NULL,
	`lessonId` int NOT NULL,
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(30) NOT NULL,
	`capacity` int,
	`supervisorId` varchar(36),
	`gradeId` int NOT NULL,
	CONSTRAINT `class_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `grade` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` int NOT NULL,
	CONSTRAINT `grade_id` PRIMARY KEY(`id`),
	CONSTRAINT `grade_level_unique` UNIQUE(`level`)
);
--> statement-breakpoint
CREATE TABLE `announcement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` varchar(255) NOT NULL,
	`date` datetime NOT NULL,
	`classId` int NOT NULL,
	CONSTRAINT `announcement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exam` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(30) NOT NULL,
	`start` datetime NOT NULL,
	`end` datetime NOT NULL,
	`lesson_id` int NOT NULL,
	CONSTRAINT `exam_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `result` (
	`id` int AUTO_INCREMENT NOT NULL,
	`score` int NOT NULL,
	`studentId` varchar(36) NOT NULL,
	`examId` int,
	`assignmentId` int,
	CONSTRAINT `result_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` varchar(255) NOT NULL,
	`startDate` datetime NOT NULL,
	`endDate` datetime NOT NULL,
	`classId` int,
	CONSTRAINT `event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(30) NOT NULL,
	`startDate` datetime NOT NULL,
	`dueDate` datetime NOT NULL,
	`lessonId` int NOT NULL,
	CONSTRAINT `assignment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student` ADD CONSTRAINT `student_parentId_parent_id_fk` FOREIGN KEY (`parentId`) REFERENCES `parent`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student` ADD CONSTRAINT `student_classId_class_id_fk` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student` ADD CONSTRAINT `student_gradeId_grade_id_fk` FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacherToSubject` ADD CONSTRAINT `teacherToSubject_teacher_id_teacher_id_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teacher`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teacherToSubject` ADD CONSTRAINT `teacherToSubject_subject_id_subject_id_fk` FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_subjectId_subject_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subject`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_teacherId_teacher_id_fk` FOREIGN KEY (`teacherId`) REFERENCES `teacher`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson` ADD CONSTRAINT `lesson_classId_class_id_fk` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_studentId_student_id_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_lessonId_lesson_id_fk` FOREIGN KEY (`lessonId`) REFERENCES `lesson`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class` ADD CONSTRAINT `class_supervisorId_teacher_id_fk` FOREIGN KEY (`supervisorId`) REFERENCES `teacher`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class` ADD CONSTRAINT `class_gradeId_grade_id_fk` FOREIGN KEY (`gradeId`) REFERENCES `grade`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `announcement` ADD CONSTRAINT `announcement_classId_class_id_fk` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exam` ADD CONSTRAINT `exam_lesson_id_lesson_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result` ADD CONSTRAINT `result_studentId_student_id_fk` FOREIGN KEY (`studentId`) REFERENCES `student`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result` ADD CONSTRAINT `result_examId_exam_id_fk` FOREIGN KEY (`examId`) REFERENCES `exam`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result` ADD CONSTRAINT `result_assignmentId_assignment_id_fk` FOREIGN KEY (`assignmentId`) REFERENCES `assignment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event` ADD CONSTRAINT `event_classId_class_id_fk` FOREIGN KEY (`classId`) REFERENCES `class`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignment` ADD CONSTRAINT `assignment_lessonId_lesson_id_fk` FOREIGN KEY (`lessonId`) REFERENCES `lesson`(`id`) ON DELETE no action ON UPDATE no action;