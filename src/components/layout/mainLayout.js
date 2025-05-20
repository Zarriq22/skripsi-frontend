import { Component } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./layout";
import httpRequest from "../../plugin/httpRequest";

// Bungkus MainLayout dengan HOC untuk dapatkan location
function withRouter(ComponentClass) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return <ComponentClass {...props} location={location} navigate={navigate} />;
  };
}

class MainLayout extends Component {
  constructor(props) {
    super(props);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const role = userData?.user?.role || null;

    this.state = {
      userData,
      userDetail: null,
      role,
    };
  }

  async componentDidMount() {
    try {
      const { user } = this.state.userData;
      if (user?.id) {
        const getMe = await httpRequest(
          process.env.REACT_APP_BASE_URL,
          `users/${user.id}`,
          "GET"
        );
        this.setState({
          userDetail: {
            name: getMe.initialName,
            avatar: getMe.avatar,
            id: getMe._id,
          },
        });
      }
    } catch (error) {
      console.error("Gagal ambil data user:", error);
    }
  }

  render() {
    const { location, children } = this.props;
    const { userDetail, role } = this.state;

    const noLayoutRoutes = ["/","/login", "/register", "/reset-password"];
    const isNoLayout = noLayoutRoutes.includes(location.pathname);

    if (isNoLayout) return <>{children}</>;

    if (!userDetail) return <div className="p-4">Loading layout...</div>;

    const showSidebar = true;
    const showChatBot = role === "user";
    const content = role === "user" 
      ? [
          {
            name: "Profile",
            icon: "fa fa-user"
          },
          {
            name: "Pengaturan",
            icon: "fa fa-gear"
          },
          {
            name: "Keluar",
            icon: "fa fa-sign-out"
          },
        ] 
      : [
          {
            name: "Keluar",
            icon: "fa fa-sign-out"
          },
        ];

    return (
      <Layout
        title={<span>Zarrion<i className="text-cyan-500">F</i></span>}
        detail={userDetail}
        showSidebar={showSidebar}
        content={content}
        showChatBot={showChatBot}
        userId={userDetail.id}
      >
        {children}
      </Layout>
    );
  }
}

export default withRouter(MainLayout);