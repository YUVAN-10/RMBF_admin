import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import { MembersProvider } from "./context/MembersContext";
import { EventsProvider } from "./context/EventsContext";
import { MeetingsProvider } from "./context/MeetingsContext";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import MemberFormPage from "./pages/MemberFormPage";
import NewsEvents from "./pages/NewsEvents";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventFormPage from "./pages/EventFormPage";
import ThankNotes from "./pages/ThankNotes";
import Meetings from "./pages/Meetings";
import MeetingDetailsPage from "./pages/MeetingDetailsPage";
import MeetingFormPage from "./pages/MeetingFormPage";
import RtoR from "./pages/RtoR";
import RToRDetailsPage from "./pages/RToRDetailsPage";
import Settings from "./pages/Settings";

function App() {
  return (
    <MembersProvider>
      <EventsProvider>
        <MeetingsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/members/new" element={<MemberFormPage mode="add" />} />
                <Route path="/members/:id" element={<MemberProfile />} />
                <Route path="/members/:id/edit" element={<MemberFormPage mode="edit" />} />
                <Route path="/news-events" element={<NewsEvents />} />
                <Route path="/news-events/new" element={<EventFormPage mode="add" />} />
                <Route path="/news-events/:id" element={<EventDetailsPage />} />
                <Route path="/news-events/:id/edit" element={<EventFormPage mode="edit" />} />
                <Route path="/thank-notes" element={<ThankNotes />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/meetings/new" element={<MeetingFormPage mode="add" />} />
                <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
                <Route path="/meetings/:id/edit" element={<MeetingFormPage mode="edit" />} />
                <Route path="/r-to-r" element={<RtoR />} />
                <Route path="/r-to-r/:id" element={<RToRDetailsPage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </MeetingsProvider>
      </EventsProvider>
    </MembersProvider>
  );
}

export default App;
