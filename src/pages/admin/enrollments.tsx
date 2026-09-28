import { useMemo, useState } from "react";
import {
  PlusCircle,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

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
import type { Student } from "@/lib/types";

type CourseOption = {
  courseCode: string;
  courseTitle: string;
};

export default function AdminEnrollmentsPage() {
  const {
    students,
    courses,
    enrollStudents,
    dropStudentFromCourse,
  } = useEnrollmentStore();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState<string | null>(null);

  const [
    selectedStudents,
    setSelectedStudents,
  ] = useState<Student[]>([]);

  const [studentQuery, setStudentQuery] =
    useState("");

  const [filterCourse, setFilterCourse] =
    useState("all");

  const studentAnchor =
    useComboboxAnchor();

  /*
   * หาวิชาที่เลือก
   */
  const selectedCourseData =
    courses.find(
      (course) =>
        course.courseCode ===
        selectedCourse,
    );

  /*
   * หารหัสนักศึกษาที่ลงทะเบียนวิชานี้แล้ว
   */
  const registeredIds = useMemo(() => {
    if (!selectedCourse) {
      return new Set<string>();
    }

    return new Set(
      students
        .filter((student) =>
          student.enrolledCourses.includes(
            selectedCourse,
          ),
        )
        .map(
          (student) =>
            student.studentId,
        ),
    );
  }, [
    selectedCourse,
    students,
  ]);

  /*
   * นักศึกษาที่สามารถเลือกได้
   */
  const availableStudents =
    useMemo(
      () =>
        students.filter(
          (student) =>
            !registeredIds.has(
              student.studentId,
            ),
        ),
      [
        students,
        registeredIds,
      ],
    );

  const courseOptions: CourseOption[] =
    courses.map((course) => ({
      courseCode:
        course.courseCode,
      courseTitle:
        course.courseTitle,
    }));

  /*
   * Reset Dialog
   */
  const resetDialog = () => {
    setSelectedCourse(null);
    setSelectedStudents([]);
    setStudentQuery("");
  };

  const handleDialogOpenChange = (
    open: boolean,
  ) => {
    setDialogOpen(open);

    if (!open) {
      resetDialog();
    }
  };

  /*
   * เมื่อเปลี่ยนวิชา
   * ต้องล้างนักศึกษาที่เลือกไว้
   */
  const handleCourseChange = (
    courseCode: string,
  ) => {
    setSelectedCourse(
      courseCode,
    );

    setSelectedStudents([]);
    setStudentQuery("");
  };

  /*
   * เมื่อเลือกนักศึกษา
   */
  const handleStudentChange = (
    value:
      | Student[]
      | Student
      | null,
  ) => {
    setSelectedStudents(
      Array.isArray(value)
        ? value
        : [],
    );

    setStudentQuery("");
  };

  /*
   * ลงทะเบียน
   */
  const handleEnroll = () => {
    if (
      !selectedCourse ||
      selectedStudents.length ===
        0
    ) {
      return;
    }

    enrollStudents(
      selectedCourse,
      selectedStudents.map(
        (student) =>
          student.studentId,
      ),
    );

    handleDialogOpenChange(
      false,
    );
  };

  /*
   * กรองตาราง
   */
  const visibleCourses =
    courses.filter(
      (course) =>
        filterCourse ===
          "all" ||
        course.courseCode ===
          filterCourse,
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">
          จัดการการลงทะเบียน
        </h1>

        <p className="text-sm text-muted-foreground">
          เลือกวิชา
          แล้วลงทะเบียนให้นักศึกษา
          ได้มากกว่า 1 คนพร้อมกัน
        </p>
      </div>

      {/* Dialog ลงทะเบียน */}
      <Dialog
        open={dialogOpen}
        onOpenChange={
          handleDialogOpenChange
        }
      >
        <DialogTrigger
          render={<Button />}
        >
          <PlusCircle className="size-4" />
          ลงทะเบียนให้นักศึกษา
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ลงทะเบียนให้นักศึกษา
            </DialogTitle>

            <DialogDescription>
              ต้องเลือกวิชาก่อน
              จากนั้นจึงเลือกนักศึกษา
              ได้หลายคน
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* เลือกวิชา */}
            <div className="grid gap-1.5">
              <Label htmlFor="course-select">
                วิชา
              </Label>

              <Select
                value={
                  selectedCourse
                }
                onValueChange={(
                  value,
                ) =>
                  handleCourseChange(
                    value as string,
                  )
                }
              >
                <SelectTrigger
                  id="course-select"
                  className="w-full"
                >
                  <SelectValue placeholder="เลือกวิชา" />
                </SelectTrigger>

                <SelectContent>
                  {courseOptions.map(
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
              <Label htmlFor="student-combobox">
                นักศึกษา
              </Label>

              <Combobox
                items={
                  availableStudents
                }
                multiple
                value={
                  selectedStudents
                }
                inputValue={
                  studentQuery
                }
                onInputValueChange={
                  setStudentQuery
                }
                onValueChange={
                  handleStudentChange
                }
                itemToStringValue={(
                  student,
                ) =>
                  `${student.studentId} — ${student.firstName} ${student.lastName}`
                }
                disabled={
                  !selectedCourse
                }
              >
                <ComboboxChips
                  id="student-combobox"
                  ref={
                    studentAnchor
                  }
                >
                  <ComboboxValue>
                    {(
                      value: Student[],
                    ) =>
                      value.map(
                        (student) => (
                          <ComboboxChip
                            key={
                              student.studentId
                            }
                          >
                            {
                              student.firstName
                            }{" "}
                            {
                              student.lastName
                            }
                          </ComboboxChip>
                        ),
                      )
                    }
                  </ComboboxValue>

                  <ComboboxChipsInput
                    placeholder={
                      selectedCourse
                        ? "เลือกนักศึกษา"
                        : "กรุณาเลือกวิชาก่อน"
                    }
                    disabled={
                      !selectedCourse
                    }
                  />
                </ComboboxChips>

                <ComboboxContent
                  anchor={
                    studentAnchor
                  }
                >
                  <ComboboxEmpty>
                    {!selectedCourse
                      ? "กรุณาเลือกวิชาก่อน"
                      : "ไม่มีนักศึกษาที่เลือกได้"}
                  </ComboboxEmpty>

                  <ComboboxList>
                    {(
                      student: Student,
                    ) => (
                      <ComboboxItem
                        key={
                          student.studentId
                        }
                        value={student}
                      >
                        {
                          student.studentId
                        }{" "}
                        —{" "}
                        {
                          student.firstName
                        }{" "}
                        {
                          student.lastName
                        }
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
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
              <PlusCircle className="size-4" />

              ลงทะเบียน (
              {
                selectedStudents.length
              }{" "}
              คน)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter */}
      <div className="max-w-sm">
        <Label htmlFor="filter-course">
          กรองวิชา
        </Label>

        <Select
          value={filterCourse}
          onValueChange={(value) =>
            setFilterCourse(
              value as string,
            )
          }
        >
          <SelectTrigger
            id="filter-course"
            className="mt-1.5 w-full"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              ทุกวิชา
            </SelectItem>

            {courseOptions.map(
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

              <TableHead>
                จำนวนนักศึกษา
              </TableHead>

              <TableHead>
                นักศึกษาที่ลงทะเบียน
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleCourses.map(
              (course) => {
                const enrolled =
                  students.filter(
                    (student) =>
                      student.enrolledCourses.includes(
                        course.courseCode,
                      ),
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

                    <TableCell>
                      {
                        enrolled.length
                      }
                    </TableCell>

                    <TableCell>
                      {enrolled.length ===
                      0 ? (
                        <span className="text-muted-foreground">
                          ยังไม่มีนักศึกษาลงทะเบียน
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {enrolled.map(
                            (
                              student,
                            ) => (
                              <Badge
                                key={
                                  student.studentId
                                }
                                variant="secondary"
                                className="gap-1"
                              >
                                {
                                  student.firstName
                                }{" "}
                                {
                                  student.lastName
                                }

                                <button
                                  type="button"
                                  className="rounded-full outline-none hover:text-destructive"
                                  aria-label={`ยกเลิกการลงทะเบียน ${student.firstName} ${student.lastName}`}
                                  onClick={() =>
                                    dropStudentFromCourse(
                                      course.courseCode,
                                      student.studentId,
                                    )
                                  }
                                >
                                  <X className="size-3" />
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