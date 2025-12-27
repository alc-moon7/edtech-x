import { Outlet } from "react-router-dom";
import { StudentProvider } from "@/lib/store";

export default function RootLayout() {
  return (
    <StudentProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Outlet />
      </div>
    </StudentProvider>
  );
}
