import {
  BookOpen,
  Home,
  LibraryBig,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "หน้าแรก",
    url: "/",
    icon: Home,
  },
  {
    title: "จัดการวิชาเรียน",
    url: "/admin/courses",
    icon: LibraryBig,
  },
  {
    title: "จัดการการลงทะเบียน",
    url: "/admin/enrollments",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2 text-lg font-semibold">
          CPE & ISNE
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            เมนู
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
  {items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        onClick={() => {
          window.location.href = item.url;
        }}
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          Computer Engineering Lab
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}