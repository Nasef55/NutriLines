import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-5">

      <h1 className="text-2xl font-bold text-blue-600 mb-8">
        🏥 NutriLines
      </h1>


      <div className="space-y-4">

        <Link
          to="/"
          className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
        >
          🏠 Dashboard
        </Link>


        <Link
          to="/reports"
          className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
        >
          📄 Reports
        </Link>


<Link
  to="/analysis"
  className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
>
  🤖 AI Analysis
</Link>


<Link
  to="/nutrition"
  className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
>
  🍎 Nutrition
</Link>


<Link
  to="/medications"
  className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
>
  💊 Medications
</Link>


<Link
  to="/profile"
  className="block w-full text-left p-3 rounded-xl hover:bg-blue-50"
>
  👤 Profile
</Link>


      </div>

    </div>
  );
}

export default Sidebar;