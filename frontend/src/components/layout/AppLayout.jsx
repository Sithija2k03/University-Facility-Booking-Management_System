import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <AppSidebar />

        <main className="min-h-screen flex-1 p-4 md:p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <TopBar />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;