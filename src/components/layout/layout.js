import { Component } from "react";
import Dropdown from "../ui/Dropdown";
import { withNavigate } from "../../router/custom/withNavigate";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.content = ['Keluar'];
    }

    handleDropdown = (item) => {
        if (item === 'Keluar') {
            localStorage.clear();
            this.props.navigate('/');
        }
    }

    render() {
        const { children, showSidebar = true, title = "ZarShop", detail = {} } = this.props;

        return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            {showSidebar && (
            <aside className="w-64 bg-blue-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Sidebar</h2>
                <ul className="space-y-2">
                    <li>
                        <a href="/dashboard" className="hover:underline">
                        Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="/profile" className="hover:underline">
                        Profil
                        </a>
                    </li>
                    <li>
                        <a href="/chatbot" className="hover:underline">
                        Chatbot
                        </a>
                    </li>
                </ul>
            </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <div>
                        <div className="flex items-center" style={{ gap: "10px" }}>
                            <div>
                                <h1 className="mr=2">Hello, <span className="capitalize">{detail.name}</span></h1>
                            </div>
                            <div>
                                <Dropdown detail={detail} content={this.props.content || this.content} onClick={this.handleDropdown}/>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6 bg-gray-100 flex-1">{children}</main>
            </div>
        </div>
        );
    }
}

export default withNavigate(Layout);
