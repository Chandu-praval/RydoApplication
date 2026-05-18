import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useAuth } from "../authContext/AuthContext";
import { getCustomerData, getDriverData } from "../../services/authService/AuthService";
import type { ICustomer } from "../../Interfaces/ICustomer";
import type { IDriver } from "../../Interfaces/IDriver";
import { toast } from "react-toastify";
import ConfirmModal from "../Common/confirmModal/ConfirmModal";
// import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdHelpCircleOutline} from "react-icons/io";

export default function Header() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();

  const [isConfirmModalOpen, setIsConfirmModalOpen] =
    useState<boolean>(false);

  const [user, setUser] = useState<ICustomer | IDriver | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] =useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigateToSection = (path: string, id: string): void => {
    navigate(`${path}#${id}`);
  };
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async (): Promise<void> => {
      if (!userData?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response =
          userData.role === "user"
            ? await getCustomerData(userData.userId)
            : await getDriverData(userData.userId);

        if (isMounted && response.data?.isSuccess) {
          setUser(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  const confirmLogout = (): void => {
    logout();
    setIsConfirmModalOpen(false);
    navigate("/");
  };
  const getUserInitial = (): string => {
    return user?.fullName?.[0]?.toUpperCase() || "";
  };
  const navLinks = [
    { name: "Home", path: "/", id: "home" },
    { name: "About Us", path: "/", id: "about" },
  ];
  return (
    <>
      <header className="driveready-navbar sticky-top">
        <nav className="navbar navbar-expand-md max-content py-1 px-4">
          <button
            className="navbar-brand border-0 bg-transparent"
            onClick={() => navigate("/")}
          >
            Rydo
          </button>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--color-on-primary)" }}
            >
              menu
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav me-auto gap-3 ms-md-4">
              {navLinks.map((link) => (
                <li className="nav-item" key={link?.id}>
                  <button
                    className="nav-link border-0 bg-transparent"
                    onClick={() =>
                      navigateToSection(link.path, link.id)
                    }
                  >
                    {link?.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
              {!userData?.userId ? (
                <>
                  <Link
                    to="/login"
                    className="navbar-login-btn text-decoration-none"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="btn navbar-signup-btn"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="nav-divider d-none d-md-block" />
                  <span className="material-symbols-outlined navbar-icon">
                    <IoMdHelpCircleOutline className="help-icon"/> <span >Help</span>
                  </span>
                  <div
                    className="profile-menu-container"
                    ref={profileMenuRef}
                  >
                    <div
                      className="profile-avatar"
                      onClick={() =>
                        setIsProfileMenuOpen(
                          !isProfileMenuOpen
                        )
                      }
                    >
                      {isLoading ? "..." : getUserInitial()}
                    </div>
                    {isProfileMenuOpen && (
                      <div className="profile-dropdown">
                        <button
                          className="profile-dropdown-item"
                          onClick={() => {
                            navigate("/profile");
                            setIsProfileMenuOpen(false);
                          }}
                        >
                          Profile
                        </button>
                        <button
                          className="profile-dropdown-item logout-item"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setIsConfirmModalOpen(true);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
      <ConfirmModal
        isOpenModal={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        submit={confirmLogout}
        confirmBtnText="Logout"
        confirmText="logout"
      />
    </>
  );
}