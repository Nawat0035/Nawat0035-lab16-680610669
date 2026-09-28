import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";

import type {
  Course,
  Student,
} from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];

  // เพิ่มวิชา
  addCourse: (course: Course) => void;

  // ลบผู้สอนออกจากวิชา
  removeInstructor: (
    courseCode: string,
    instructor: string,
  ) => void;

  // ลงทะเบียนนักศึกษาหลายคนในวิชา
  enrollStudents: (
    courseCode: string,
    studentIds: string[],
  ) => void;

  // ยกเลิกการลงทะเบียนของนักศึกษา
  dropStudentFromCourse: (
    courseCode: string,
    studentId: string,
  ) => void;

  // ลบนักศึกษา
  removeStudent: (
    studentId: string,
  ) => void;

  // ลบวิชา
  removeCourse: (
    courseCode: string,
  ) => void;
};

export const useEnrollmentStore =
  create<EnrollmentStore>()(
    persist(
      (set) => ({
        students: initialStudents,
        courses: initialCourses,

        // ========================================
        // เพิ่มวิชา
        // ========================================
        addCourse: (course) =>
          set((state) => ({
            courses: [
              ...state.courses,
              course,
            ],
          })),

        // ========================================
        // ลบผู้สอนออกจากวิชา
        // ========================================
        removeInstructor: (
          courseCode,
          instructor,
        ) =>
          set((state) => ({
            courses: state.courses.map(
              (course) =>
                course.courseCode ===
                courseCode
                  ? {
                      ...course,
                      instructors: (
                        course.instructors ??
                        []
                      ).filter(
                        (name) =>
                          name !==
                          instructor,
                      ),
                    }
                  : course,
            ),
          })),

        // ========================================
        // ลงทะเบียนนักศึกษาหลายคน
        // ========================================
        enrollStudents: (
          courseCode,
          studentIds,
        ) =>
          set((state) => ({
            students:
              state.students.map(
                (student) =>
                  studentIds.includes(
                    student.studentId,
                  ) &&
                  !student.enrolledCourses.includes(
                    courseCode,
                  )
                    ? {
                        ...student,
                        enrolledCourses: [
                          ...student.enrolledCourses,
                          courseCode,
                        ],
                      }
                    : student,
              ),
          })),

        // ========================================
        // ยกเลิกการลงทะเบียน
        // ========================================
        dropStudentFromCourse: (
          courseCode,
          studentId,
        ) =>
          set((state) => ({
            students:
              state.students.map(
                (student) =>
                  student.studentId ===
                  studentId
                    ? {
                        ...student,
                        enrolledCourses:
                          student.enrolledCourses.filter(
                            (code) =>
                              code !==
                              courseCode,
                          ),
                      }
                    : student,
              ),
          })),

        // ========================================
        // ลบนักศึกษา
        // ========================================
        removeStudent: (studentId) =>
          set((state) => ({
            students:
              state.students.filter(
                (student) =>
                  student.studentId !==
                  studentId,
              ),
          })),

        // ========================================
        // ลบวิชา
        // และลบรหัสวิชานั้นออกจาก
        // enrolledCourses ของนักศึกษาทุกคน
        // ========================================
        removeCourse: (courseCode) =>
          set((state) => ({
            courses:
              state.courses.filter(
                (course) =>
                  course.courseCode !==
                  courseCode,
              ),

            students:
              state.students.map(
                (student) => ({
                  ...student,

                  enrolledCourses:
                    student.enrolledCourses.filter(
                      (code) =>
                        code !==
                        courseCode,
                    ),
                }),
              ),
          })),
      }),

      // ========================================
      // Local Storage
      // ========================================
      {
        name: "lab16-2569-680610669",

        partialize: (state) => ({
          students: state.students,
          courses: state.courses,
        }),
      },
    ),
  );