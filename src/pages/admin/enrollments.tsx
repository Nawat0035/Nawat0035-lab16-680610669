import { useState } from "react";
import {
  PlusCircle,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { MultiCombobox } from "@/components/ui/combobox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminEnrollmentsPage() {
  const {
    students,
    courses,
    enrollStudents,
    dropStudentFromCourse,
  } = useEnrollmentStore();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  /*
   * วิชาที่เลือกใน Dialog
   */
  const [selectedCourse, setSelectedCourse] =
    useState<string | null>(null);

  /*
   * นักศึกษาที่เลือกหลายคน
   */
  const [selectedStudents, setSelectedStudents] =
    useState<string[]>([]);

  /*
   * ตัวกรองตาราง
   */
  const [filterCourse, setFilterCourse] =
    useState("all");

  /*
   * หลังเลือกวิชาแล้ว
   * แสดงเฉพาะนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น
   */
  const eligibleStudents =
    selectedCourse
      ? students.filter(
          (student) =>
            !student.enrolledCourses.includes(
              selectedCourse,
            ),
        )
      : [];

  /*
   * เมื่อเปลี่ยนวิชา
   * ต้องล้างนักศึกษาที่เลือกไว้
   * ตามโจทย์ข้อ 4.1
   */
  const handleCourseChange = (
    courseCode: string,
  ) => {
    setSelectedCourse(courseCode);
    setSelectedStudents([]);
  };

  /*
   * เมื่อปิด Dialog
   * ล้างค่าทั้งหมด
   */
  const handleDialogChange = (
    open: boolean,
  ) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedCourse(null);
      setSelectedStudents([]);
    }
  };

  /*
   * ลงทะเบียนนักศึกษาหลายคน
   */
  const handleEnroll = () => {
    if (
      !selectedCourse ||
      selectedStudents.length === 0
    ) {
      return;
    }

    enrollStudents(
      selectedCourse,
      selectedStudents,
    );

    setDialogOpen(false);
  };

  /*
   * กรองวิชาในตาราง
   */
  const visibleCourses =
    filterCourse === "all"
      ? courses
      : courses.filter(
          (course) =>
            course.courseCode ===
            filterCourse,
        );

  /*
   * หานักศึกษาที่ลงทะเบียนวิชานี้
   */
  const studentsOfCourse = (
    courseCode: string,
  ) =>
    students.filter((student) =>
      student.enrolledCourses.includes(
        courseCode,
      ),
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="
          flex flex-col justify-between gap-3
          sm:flex-row sm:items-center
        "
      >
        <div>
          <h1 className="text-xl font-semibold">
            จัดการการลงทะเบียน
          </h1>

          <p className="text-sm text-muted-foreground">
            Admin ลงทะเบียนและยกเลิก
            การลงทะเบียนให้นักศึกษาได้ทุกคน
          </p>
        </div>

        {/* Dialog ลงทะเบียน */}
        <Dialog
          open={dialogOpen}
          onOpenChange={
            handleDialogChange
          }
        >
          <DialogTrigger
            render={<Button />}
          >
            <PlusCircle />
            ลงทะเบียนให้นักศึกษา
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                ลงทะเบียนให้นักศึกษา
              </DialogTitle>

              <DialogDescription>
                เลือกวิชาก่อน
                แล้วเลือกนักศึกษาได้มากกว่า 1 คน
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* เลือกวิชา */}
              <div className="grid gap-1.5">
                <Label htmlFor="enrollmentCourse">
                  วิชา
                </Label>

                <Select
                  items={courses.map(
                    (course) => ({
                      value:
                        course.courseCode,
                      label: `${course.courseCode} — ${course.courseTitle}`,
                    }),
                  )}
                  value={selectedCourse}
                  onValueChange={(value) => {
                    if (value) {
                      handleCourseChange(
                        value as string,
                      );
                    }
                  }}
                >
                  <SelectTrigger
                    id="enrollmentCourse"
                    className="w-full"
                  >
                    <SelectValue placeholder="เลือกวิชา" />
                  </SelectTrigger>

                  <SelectContent>
                    {courses.map(
                      (course) => (
                        <SelectItem
                          key={
                            course.courseCode
                          }
                          value={
                            course.courseCode
                          }
                        >
                          {
                            course.courseCode
                          }{" "}
                          —{" "}
                          {
                            course.courseTitle
                          }
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* เลือกนักศึกษา */}
              <div className="grid gap-1.5">
                <Label>
                  นักศึกษา
                </Label>

                <MultiCombobox
                  options={eligibleStudents.map(
                    (student) => ({
                      value:
                        student.studentId,
                      label: `${student.studentId} — ${student.firstName} ${student.lastName}`,
                    }),
                  )}
                  value={selectedStudents}
                  onValueChange={
                    setSelectedStudents
                  }
                  placeholder={
                    selectedCourse
                      ? "เลือกนักศึกษาได้หลายคน"
                      : "กรุณาเลือกวิชาก่อน"
                  }
                  disabled={
                    !selectedCourse
                  }
                  emptyText={
                    selectedCourse
                      ? "นักศึกษาทุกคนลงทะเบียนวิชานี้แล้ว"
                      : "กรุณาเลือกวิชาก่อน"
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={
                  !selectedCourse ||
                  selectedStudents.length ===
                    0
                }
                onClick={
                  handleEnroll
                }
              >
                <PlusCircle />

                ลงทะเบียน (
                {selectedStudents.length} คน)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ตัวกรอง */}
      <div className="grid gap-1.5 sm:max-w-sm">
        <Label htmlFor="filterCourse">
          กรองตามวิชา
        </Label>

        <Select
          items={[
            {
              value: "all",
              label: "ทุกวิชา",
            },
            ...courses.map(
              (course) => ({
                value:
                  course.courseCode,
                label: `${course.courseCode} — ${course.courseTitle}`,
              }),
            ),
          ]}
          value={filterCourse}
          onValueChange={(value) =>
            setFilterCourse(
              (value as string) ??
                "all",
            )
          }
        >
          <SelectTrigger
            id="filterCourse"
            className="w-full"
          >
            <SelectValue placeholder="เลือกวิชา" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              ทุกวิชา
            </SelectItem>

            {courses.map(
              (course) => (
                <SelectItem
                  key={
                    course.courseCode
                  }
                  value={
                    course.courseCode
                  }
                >
                  {course.courseCode} —{" "}
                  {course.courseTitle}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* ตาราง */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                รหัสวิชา
              </TableHead>

              <TableHead>
                ชื่อวิชา
              </TableHead>

              <TableHead className="text-center">
                จำนวนนักศึกษา
              </TableHead>

              <TableHead>
                นักศึกษาที่ลงทะเบียน
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleCourses.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="
                    h-20 text-center
                    text-muted-foreground
                  "
                >
                  ไม่พบข้อมูลวิชา
                </TableCell>
              </TableRow>
            )}

            {visibleCourses.map(
              (course) => {
                const enrolledStudents =
                  studentsOfCourse(
                    course.courseCode,
                  );

                return (
                  <TableRow
                    key={
                      course.courseCode
                    }
                  >
                    <TableCell className="font-medium">
                      {
                        course.courseCode
                      }
                    </TableCell>

                    <TableCell>
                      {
                        course.courseTitle
                      }
                    </TableCell>

                    <TableCell className="text-center">
                      {
                        enrolledStudents.length
                      }
                    </TableCell>

                    <TableCell>
                      {enrolledStudents.length ===
                      0 ? (
                        <span className="text-sm text-muted-foreground">
                          ยังไม่มีนักศึกษา
                          ลงทะเบียน
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {enrolledStudents.map(
                            (student) => (
                              <Badge
                                key={
                                  student.studentId
                                }
                                variant="secondary"
                              >
                                {
                                  student.firstName
                                }{" "}
                                {
                                  student.lastName
                                }

                                <button
                                  type="button"
                                  className="
                                    rounded-full
                                    hover:text-destructive
                                  "
                                  aria-label={`ยกเลิก ${student.firstName} ${student.lastName}`}
                                  onClick={() =>
                                    dropStudentFromCourse(
                                      course.courseCode,
                                      student.studentId,
                                    )
                                  }
                                >
                                  <X />
                                </button>
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}