import { useMemo, useState } from "react";
import {
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MultiCombobox } from "@/components/ui/combobox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminCoursesPage() {
  const {
    courses,
    addCourse,
    removeCourse,
    removeInstructor,
  } = useEnrollmentStore();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [courseCode, setCourseCode] =
    useState("");

  const [courseTitle, setCourseTitle] =
    useState("");

  const [instructors, setInstructors] =
    useState<string[]>([]);

  const [deleteCode, setDeleteCode] =
    useState<string | null>(null);

  /*
   * รวมชื่อผู้สอนจากทุกวิชา
   * และตัดชื่อซ้ำออก
   */
  const instructorOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        courses.flatMap(
          (course) =>
            course.instructors ?? [],
        ),
      ),
    );

    return names.map((name) => ({
      value: name,
      label: name,
    }));
  }, [courses]);

  /*
   * ตรวจรหัสวิชาซ้ำ
   * ไม่สนตัวพิมพ์เล็ก-ใหญ่
   * เช่น cs101 กับ CS101 ถือว่าซ้ำกัน
   */
  const duplicateCode = courses.some(
    (course) =>
      course.courseCode.toLowerCase() ===
      courseCode
        .trim()
        .toLowerCase(),
  );

  const canSave =
    courseCode.trim() !== "" &&
    courseTitle.trim() !== "" &&
    !duplicateCode;

  const resetForm = () => {
    setCourseCode("");
    setCourseTitle("");
    setInstructors([]);
  };

  const handleDialogChange = (
    open: boolean,
  ) => {
    setDialogOpen(open);

    if (!open) {
      resetForm();
    }
  };

  const handleAddCourse = () => {
    if (!canSave) {
      return;
    }

    addCourse({
      courseCode: courseCode
        .trim()
        .toUpperCase(),

      courseTitle:
        courseTitle.trim(),

      instructors,
    });

    setDialogOpen(false);
    resetForm();
  };

  const handleRemoveCourse = () => {
    if (!deleteCode) {
      return;
    }

    removeCourse(deleteCode);
    setDeleteCode(null);
  };

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
            จัดการวิชาเรียน
          </h1>

          <p className="text-sm text-muted-foreground">
            จัดการรายวิชาและผู้สอนของแต่ละวิชา
          </p>
        </div>

        {/* Dialog เพิ่มวิชา */}
        <Dialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
        >
          <DialogTrigger
            render={<Button />}
          >
            <PlusCircle />
            เพิ่มวิชา
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                เพิ่มวิชา
              </DialogTitle>

              <DialogDescription>
                กรอกรหัสวิชา ชื่อวิชา
                และผู้สอน
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* รหัสวิชา */}
              <div className="grid gap-1.5">
                <Label htmlFor="courseCode">
                  รหัสวิชา
                </Label>

                <Input
                  id="courseCode"
                  value={courseCode}
                  aria-invalid={
                    duplicateCode
                  }
                  placeholder="เช่น CS101"
                  onChange={(event) =>
                    setCourseCode(
                      event.target.value,
                    )
                  }
                />

                {duplicateCode && (
                  <p className="text-sm text-destructive">
                    มีรหัสวิชา{" "}
                    {courseCode
                      .trim()
                      .toUpperCase()}{" "}
                    นี้แล้ว
                  </p>
                )}
              </div>

              {/* ชื่อวิชา */}
              <div className="grid gap-1.5">
                <Label htmlFor="courseTitle">
                  ชื่อวิชา
                </Label>

                <Input
                  id="courseTitle"
                  value={courseTitle}
                  placeholder="เช่น Data Structures"
                  onChange={(event) =>
                    setCourseTitle(
                      event.target.value,
                    )
                  }
                />
              </div>

              {/* ผู้สอน */}
              <div className="grid gap-1.5">
                <Label>
                  ผู้สอน
                </Label>

                <MultiCombobox
                  options={
                    instructorOptions
                  }
                  value={instructors}
                  onValueChange={
                    setInstructors
                  }
                  placeholder="เลือกหรือพิมพ์ผู้สอน"
                  allowCustom
                  addText="เพิ่มผู้สอน"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={!canSave}
                onClick={
                  handleAddCourse
                }
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ตารางวิชา */}
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
                ผู้สอน
              </TableHead>

              <TableHead className="w-20 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="
                    h-20 text-center
                    text-muted-foreground
                  "
                >
                  ยังไม่มีข้อมูลวิชา
                </TableCell>
              </TableRow>
            )}

            {courses.map((course) => (
              <TableRow
                key={course.courseCode}
              >
                {/* รหัส */}
                <TableCell className="font-medium">
                  {course.courseCode}
                </TableCell>

                {/* ชื่อ */}
                <TableCell>
                  {course.courseTitle}
                </TableCell>

                {/* ผู้สอน */}
                <TableCell>
                  {(course.instructors ??
                    []).length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      ยังไม่มีผู้สอน
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        course.instructors ??
                        []
                      ).map(
                        (instructor) => (
                          <Badge
                            key={
                              instructor
                            }
                            variant="secondary"
                          >
                            {instructor}

                            <button
                              type="button"
                              className="
                                rounded-full
                                hover:text-destructive
                              "
                              aria-label={`ลบผู้สอน ${instructor}`}
                              onClick={() =>
                                removeInstructor(
                                  course.courseCode,
                                  instructor,
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

                {/* Action */}
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`ลบวิชา ${course.courseCode}`}
                    onClick={() =>
                      setDeleteCode(
                        course.courseCode,
                      )
                    }
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog ยืนยันการลบ */}
      <AlertDialog
        open={deleteCode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCode(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ยืนยันการลบวิชา
            </AlertDialogTitle>

            <AlertDialogDescription>
              ต้องการลบวิชา{" "}
              {deleteCode} ใช่หรือไม่?
              การลบวิชาจะนำรหัสวิชานี้
              ออกจากการลงทะเบียน
              ของนักศึกษาด้วย
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              ยกเลิก
            </AlertDialogCancel>

            <AlertDialogAction
              className="
                bg-destructive
                text-destructive-foreground
                hover:bg-destructive/90
              "
              onClick={
                handleRemoveCourse
              }
            >
              ลบวิชา
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}