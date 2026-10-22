
import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "🏠 Dashboard" },
  { to: "/reports", label: "📄 Reports" },
  { to: "/analysis", label: "🤖 AI Analysis" },
  { to: "/nutrition", label: "🍎 Nutrition" },
  { to: "/medications", label: "💊 Medications" },
  { to: "/doctors", label: "👨‍⚕️ Doctor Consultation" },
  { to: "/pharmacy", label: "💊 Pharmacy" },
  { to: "/profile", label: "👤 Profile" },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = (
    <nav className="space-y-2">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setIsOpen(false)}
          className="block w-full rounded-xl p-3 text-left hover:bg-blue-50"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="fixed left-4 top-4 z-[60] rounded-lg bg-white p-3 text-2xl shadow-md md:hidden"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-white p-5 shadow-xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className="mb-8 mt-14 text-2xl font-bold text-blue-600">
          🏥 NutriLines
        </h1>
        {navigation}
      </aside>

      {/* Desktop and tablet sidebar */}
      <aside className="hidden min-h-screen w-64 shrink-0 bg-white p-5 shadow-lg md:block">
        <h1 className="mb-8 text-2xl font-bold text-blue-600">
          🏥 NutriLines
        </h1>
        {navigation}
      </aside>
    </>
  );
}

export default Sidebar;
