import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/Usercontext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/Modal";

const Welcome = () => {
  const { user, loading } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisteredCourses, setShowRegisteredCourses] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRegisteredPage, setCurrentRegisteredPage] = useState(1);
  const coursesPerPage = 25;

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchRegisteredCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/courses/degree/${encodeURIComponent(
          user.degree
        )}`
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const fetchRegisteredCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/courses/registered/${user._id}`
      );
      setRegisteredCourses(response.data);
    } catch (error) {
      console.error("Error fetching registered courses", error);
    }
  };

  const registerCourse = async (courseId) => {
    try {
      await axios.post("http://localhost:5000/api/courses/register", {
        userId: user._id,
        courseId,
      });
      fetchCourses();
      fetchRegisteredCourses();
      showToast("Course registered successfully", "success");
    } catch (error) {
      console.error("Error registering course", error);
      showToast("Error registering course", "error");
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.post("http://localhost:5000/api/courses/unregister", {
        userId: user._id,
        courseId,
      });
      fetchCourses();
      fetchRegisteredCourses();
      showToast("Course unregistered successfully", "success");
    } catch (error) {
      console.error("Error unregistering course", error);
      showToast("Error unregistering course", "error");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      showToast("Search query cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/courses/search/${encodeURIComponent(
          user.degree
        )}?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data);
      if (response.data.length === 0) {
        showToast("No courses found", "info");
      } else {
        showToast("Courses found", "success");
      }
    } catch (error) {
      console.error("Error searching courses", error);
      showToast("Error searching courses", "error");
    }
  };

  const handleViewRegisteredCourses = () => {
    setShowRegisteredCourses(!showRegisteredCourses);
    if (!showRegisteredCourses) {
      setShowRegister(false);
      setShowSearch(false);
    }
  };

  const handleRegisterCourses = () => {
    setShowRegister(!showRegister);
    if (!showRegister) {
      setShowRegisteredCourses(false);
      setShowSearch(false);
    }
  };

  const handleSearchCourses = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowRegister(false);
      setShowRegisteredCourses(false);
    }
  };

  const showToast = (message, type) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
        break;
    }
  };

  const paginateCourses = (courses, currentPage) => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return courses.slice(startIndex, startIndex + coursesPerPage);
  };

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const totalRegisteredPages = Math.ceil(
    registeredCourses.length / coursesPerPage
  );

  const openModal = (message, action) => {
    setModalMessage(message);
    setConfirmAction(() => () => {
      action();
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="container">
      <ToastContainer />
      <h1>Welcome, {user.username}</h1>
      <div className="buttons">
        <button
          className={showRegister ? "active" : ""}
          onClick={handleRegisterCourses}
        >
          Register Courses
        </button>
        <button
          className={showRegisteredCourses ? "active" : ""}
          onClick={handleViewRegisteredCourses}
        >
          View Registered Courses
        </button>
        <button
          className={showSearch ? "active" : ""}
          onClick={handleSearchCourses}
        >
          Search Courses
        </button>
      </div>

      {showRegister && (
        <div>
          <h2>Available Courses:</h2>
          <ul className="course-list">
            {paginateCourses(
              courses.filter(
                (course) =>
                  !registeredCourses.some((rc) => rc._id === course._id)
              ),
              currentPage
            ).map((course) => (
              <li key={course._id}>
                <div className="course-item">
                  {course.name} ({course.code})
                  <button
                    onClick={() =>
                      openModal(
                        "Are you sure you want to register for this course?",
                        () => registerCourse(course._id)
                      )
                    }
                  >
                    Register
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showRegisteredCourses && (
        <div>
          <h2>Registered Courses:</h2>
          <ul className="course-list">
            {paginateCourses(registeredCourses, currentRegisteredPage).map(
              (course) => (
                <li key={course._id}>
                  <div className="course-item">
                    {course.name} ({course.code})
                    <button
                      onClick={() =>
                        openModal(
                          "Are you sure you want to unregister from this course?",
                          () => deleteCourse(course._id)
                        )
                      }
                    >
                      Unregister
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
          <div className="pagination">
            <button
              onClick={() =>
                setCurrentRegisteredPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentRegisteredPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentRegisteredPage} of {totalRegisteredPages}
            </span>
            <button
              onClick={() =>
                setCurrentRegisteredPage((prev) =>
                  Math.min(prev + 1, totalRegisteredPages)
                )
              }
              disabled={currentRegisteredPage === totalRegisteredPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showSearch && (
        <div className="search-section">
          <div className="search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div>
            <h2>Search Results:</h2>
            <ul className="course-list">
              {searchResults.map((course) => (
                <li key={course._id}>
                  <div className="course-item">
                    {course.name} ({course.code})
                    {registeredCourses.some((rc) => rc._id === course._id) ? (
                      <button
                        onClick={() =>
                          openModal(
                            "Are you sure you want to unregister from this course?",
                            () => deleteCourse(course._id)
                          )
                        }
                      >
                        Unregister
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openModal(
                            "Are you sure you want to register for this course?",
                            () => registerCourse(course._id)
                          )
                        }
                      >
                        Register
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        message={modalMessage}
      />

      <style jsx>{`
        .container {
          width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        .buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .buttons button {
          padding: 10px 20px;
          font-size: 16px;
        }
        .buttons button.active {
          background-color: #007bff;
          color: white;
        }
        .toast-container {
          position: fixed;
          bottom: 10px;
          right: 10px;
          z-index: 1000;
        }
        .search-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .search {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .search input {
          padding: 10px;
          font-size: 16px;
          margin-right: 10px;
        }
        .search button {
          padding: 10px 20px;
          font-size: 16px;
        }
        .course-list {
          list-style-type: none;
          padding: 0;
        }
        .course-item {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          padding: 10px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .course-item button {
          padding: 5px 10px;
          font-size: 14px;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        .pagination button {
          padding: 10px 20px;
          font-size: 16px;
          margin: 0 10px;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
