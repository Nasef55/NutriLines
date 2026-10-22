
import Sidebar from "./Sidebar";

function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-gray-100">
      <Sidebar />

      <main className="min-w-0 flex-1 px-3 pb-5 pt-16 sm:p-5 md:p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
