import type { Course, Student } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CPE301"],
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CS201", "CPE302"],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    status: "Active",
    enrolledCourses: ["CPE301", "CPE302"],
  },
  {
    studentId: "650610004",
    firstName: "Florence",
    lastName: "Pugh",
    program: "CPE",
    status: "Active",
    enrolledCourses: ["CPE302"],
  },
  {
    studentId: "650610005",
    firstName: "Robert",
    lastName: "Downey",
    program: "ISNE",
    status: "Active",
    enrolledCourses: [],
  },
  {
    studentId: "650610006",
    firstName: "Zendaya",
    lastName: "Coleman",
    program: "ISNE",
    status: "Inactive",
    enrolledCourses: ["CS201"],
  },
];

export const courses: Course[] = [
  {
    courseCode: "CPE301",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseCode: "CPE302",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseCode: "CS201",
    courseTitle: "Data Structures",
    instructors: ["Cillian Murphy"],
  },
  {
    courseCode: "CPE101",
    courseTitle: "Introduction to Programming",
    instructors: ["Dome"],
  },
  {
    courseCode: "CPE401",
    courseTitle:
      "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
];

export const CURRENT_STUDENT_ID = "650610002";

export const currentStudent = students.find(
  (student) => student.studentId === CURRENT_STUDENT_ID,
)!;