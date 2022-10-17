import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NoteForm from "../components/NoteForm";
import Spinner from "../components/Spinner";
import { getNotes, reset } from "../features/notes/noteSlice";
import NoteItem from "../components/NoteItem";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { notes, isLoading, isError, message } = useSelector(
    (state) => state.notes
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
      localStorage.removeItem("user");
      navigate("/login");
    }

    if (!user) {
      navigate("/login");
    } else {
      dispatch(getNotes());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, dispatch, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.username}</h1>
        <p>Notes Dashboard</p>
      </section>

      <NoteForm />

      <section className="content">
        {notes.length > 0 ? (
          <div className="goals">
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <h3> You have not set notes</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
