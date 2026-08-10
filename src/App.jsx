import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import { MembersProvider } from "./context/MembersContext";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import MemberFormPage from "./pages/MemberFormPage";
import NewsEvents from "./pages/NewsEvents";
import ThankNotes from "./pages/ThankNotes";
import Meetings from "./pages/Meetings";
import RtoR from "./pages/RtoR";
import Settings from "./pages/Settings";

function App() {
  return (
    <MembersProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/new" element={<MemberFormPage mode="add" />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/members/:id/edit" element={<MemberFormPage mode="edit" />} />
            <Route path="/news-events" element={<NewsEvents />} />
            <Route path="/thank-notes" element={<ThankNotes />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/r-to-r" element={<RtoR />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MembersProvider>
  );
}

export default App;
