import { useMemo, useState } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";

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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEnrollmentStore } from "@/lib/enrollment-store";

type InstructorOption = {
  name: string;
  isNew?: boolean;
};

export default function AdminCoursesPage() {
  const {
    courses,
    addCourse,
    removeCourse,
    removeInstructor,
  } = useEnrollmentStore();

  const [open, setOpen] = useState(false);

  const [courseCode, setCourseCode] =
    useState("");

  const [courseTitle, setCourseTitle] =
    useState("");

  const [selectedInstructors, setSelectedInstructors] =
    useState<InstructorOption[]>([]);

  const [instructorQuery, setInstructorQuery] =
    useState("");

  const [deleteCode, setDeleteCode] =
    useState<string | null>(null);

  const instructorAnchor =
    useComboboxAnchor();

  /*
   * รวมรายชื่อผู้สอนจากทุกวิชา
   * และตัดชื่อที่ซ้ำกัน
   */
  const allInstructors = useMemo(() => {
    const names = courses.flatMap(
      (course) =>
        course.instructors ?? [],
    );

    return [
      ...new Set(names),
    ].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [courses]);

  /*
   * ตรวจรหัสวิชาซ้ำ
   * เช่น cs101 และ CS101 ถือว่าซ้ำ
   */
  const normalizedCode =
    courseCode
      .trim()
      .toLowerCase();

  const duplicateCode =
    Boolean(
      normalizedCode &&
        courses.some(
          (course) =>
            course.courseCode
              .toLowerCase() ===
            normalizedCode,
        ),
    );

  const canSave = Boolean(
    courseCode.trim() &&
      courseTitle.trim() &&
      !duplicateCode,
  );

  /*
   * รายการผู้สอนใน Combobox
   * ถ้าพิมพ์ชื่อใหม่ จะเพิ่มตัวเลือก
   * + เพิ่มผู้สอน "ชื่อ"
   */
  const instructorItems =
    useMemo(() => {
      const existing =
        allInstructors.map(
          (name) => ({
            name,
          }),
        );

      const query =
        instructorQuery.trim();

      const alreadyExists =
        allInstructors.some(
          (name) =>
            name.toLowerCase() ===
            query.toLowerCase(),
        );

      if (
        query &&
        !alreadyExists
      ) {
        return [
          ...existing,
          {
            name: query,
            isNew: true,
          },
        ];
      }

      return existing;
    }, [
      allInstructors,
      instructorQuery,
    ]);

  const resetForm = () => {
    setCourseCode("");
    setCourseTitle("");
    setSelectedInstructors([]);
    setInstructorQuery("");
  };

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  /*
   * เมื่อเลือก/ยกเลิกผู้สอน
   */
  const handleInstructorChange = (
    nextValue:
      | InstructorOption[]
      | InstructorOption
      | null,
  ) => {
    const next = Array.isArray(
      nextValue,
    )
      ? nextValue
      : [];

    /*
     * ป้องกันชื่อผู้สอนซ้ำ
     */
    const unique = next.filter(
      (
        item,
        index,
        list,
      ) =>
        list.findIndex(
          (x) =>
            x.name.toLowerCase() ===
            item.name.toLowerCase(),
        ) === index,
    );

    setSelectedInstructors(
      unique.map((item) => ({
        name: item.name,
      })),
    );

    setInstructorQuery("");
  };

  /*
   * บันทึกวิชา
   */
  const handleSave = () => {
    if (!canSave) {
      return;
    }

    addCourse({
      courseCode:
        courseCode
          .trim()
          .toUpperCase(),

      courseTitle:
        courseTitle.trim(),

      ...(selectedInstructors.length >
      0
        ? {
            instructors:
              selectedInstructors.map(
                (item) =>
                  item.name,
              ),
          }
        : {}),
    });

    handleOpenChange(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            จัดการวิชาเรียน
          </h1>

          <p className="text-sm text-muted-foreground">
            เพิ่ม ลบ และจัดการผู้สอนของรายวิชา
          </p>
        </div>

        {/* Dialog เพิ่มวิชา */}
        <Dialog
          open={open}
          onOpenChange={
            handleOpenChange
          }
        >
          <DialogTrigger
            render={<Button />}
          >
            <PlusCircle className="size-4" />
            เพิ่มวิชา
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                เพิ่มวิชา
              </DialogTitle>

              <DialogDescription>
                กรอกรหัสวิชา ชื่อวิชา
                และเลือกผู้สอนได้หลายคน
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
                  onChange={(event) =>
                    setCourseCode(
                      event.target.value,
                    )
                  }
                  placeholder="เช่น CS101"
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
                  onChange={(event) =>
                    setCourseTitle(
                      event.target.value,
                    )
                  }
                  placeholder="ชื่อวิชา"
                />
              </div>

              {/* ผู้สอน */}
              <div className="grid gap-1.5">
                <Label>
                  ผู้สอน
                </Label>

                <Combobox
                  items={
                    instructorItems
                  }
                  multiple
                  value={
                    selectedInstructors
                  }
                  inputValue={
                    instructorQuery
                  }
                  onInputValueChange={
                    setInstructorQuery
                  }
                  onValueChange={
                    handleInstructorChange
                  }
                  itemToStringValue={(
                    item,
                  ) => item.name}
                  isItemEqualToValue={(
                    item,
                    value,
                  ) =>
                    item.name ===
                    value.name
                  }
                >
                  <ComboboxChips
                    ref={
                      instructorAnchor
                    }
                  >
                    <ComboboxValue>
                      {(
                        value: InstructorOption[],
                      ) =>
                        value.map(
                          (item) => (
                            <ComboboxChip
                              key={
                                item.name
                              }
                            >
                              {
                                item.name
                              }
                            </ComboboxChip>
                          ),
                        )
                      }
                    </ComboboxValue>

                    <ComboboxChipsInput
                      placeholder="เลือกหรือพิมพ์ชื่อผู้สอน"
                    />
                  </ComboboxChips>

                  <ComboboxContent
                    anchor={
                      instructorAnchor
                    }
                  >
                    <ComboboxEmpty>
                      ไม่พบผู้สอน
                    </ComboboxEmpty>

                    <ComboboxList>
                      {(
                        item: InstructorOption,
                      ) => (
                        <ComboboxItem
                          key={`${item.isNew ? "new" : "old"}-${item.name}`}
                          value={item}
                        >
                          {item.isNew
                            ? `+ เพิ่มผู้สอน "${item.name}"`
                            : item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  handleOpenChange(false)
                }
              >
                ยกเลิก
              </Button>

              <Button
                disabled={!canSave}
                onClick={handleSave}
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
            {courses.map(
              (course) => {
                const instructors =
                  course.instructors ??
                  [];

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
                      {instructors.length ===
                      0 ? (
                        <span className="text-muted-foreground">
                          ยังไม่มีผู้สอน
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {instructors.map(
                            (
                              instructor,
                            ) => (
                              <Badge
                                key={
                                  instructor
                                }
                                variant="secondary"
                                className="gap-1"
                              >
                                {
                                  instructor
                                }

                                <button
                                  type="button"
                                  className="rounded-full outline-none hover:text-destructive"
                                  aria-label={`ลบผู้สอน ${instructor}`}
                                  onClick={() =>
                                    removeInstructor(
                                      course.courseCode,
                                      instructor,
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

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        aria-label={`ลบวิชา ${course.courseCode}`}
                        onClick={() =>
                          setDeleteCode(
                            course.courseCode,
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </div>

      {/* AlertDialog ยืนยันลบ */}
      <AlertDialog
        open={
          deleteCode !== null
        }
        onOpenChange={(value) => {
          if (!value) {
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
              การลงทะเบียนของนักศึกษา
              ที่อ้างถึงวิชานี้จะถูกนำออกด้วย
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              ยกเลิก
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteCode) {
                  removeCourse(
                    deleteCode,
                  );
                }

                setDeleteCode(null);
              }}
            >
              ลบวิชา
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}