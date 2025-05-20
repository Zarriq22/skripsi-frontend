import { Component } from "react";
import Dropdown from "../ui/Dropdown";
import { withNavigate } from "../../router/custom/withNavigate";
import { Link } from "react-router-dom";
import logo from "../../assets/avatar/logo.png";
import Button from "../ui/Button";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMenu: "beranda"
        };
        this.content = ['Keluar'];
    }

    handleDropdown = (item) => {
        if (item === 'Keluar') {
            localStorage.clear();
            this.props.navigate('/');
        }
    }

    setActiveMenu = (menu) => {
        this.setState({ activeMenu: menu });
    }

    render() {
        const { children, showSidebar = true, title = "ZarionF", detail = {}, showChatBot, userId } = this.props;
        const { activeMenu } = this.state;

        const navItems = [
            { path: "/dashboard-product", label: "Beranda", key: "beranda" },
            { path: `/product-favorite/${detail.id}`, label: "Produk Favorit", key: "product-favorite" },
            { path: `/pesanan-saya`, label: "Pesanan Saya", key: "pesanan-saya" },
            { path: `/customer-service/:${userId}`, label: "Customer Service", key: "customer-service" },
        ];

        return (
            <div className="flex min-h-screen overflow-hidden">
                {showSidebar && (
                <aside className="hidden md:flex flex-col w-64 bg-blue-800 text-white p-4 gap-4">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="rounded-full w-[50px]" />
                        <h2 className="text-xl font-bold">ZarionF</h2>
                    </div>
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <Link to={item.path} key={item.key}>
                                <li className="mb-2">
                                    <Button
                                        text={item.label}
                                        cssClass={`rounded text-left w-full px-4 py-2 cursor-pointer 
                                            ${activeMenu === item.key ? 'bg-white text-black' : ''} hover:bg-white hover:text-black`}
                                        onClick={() => this.setActiveMenu(item.key)}
                                    />
                                </li>
                            </Link>
                        ))}
                    </ul>
                </aside>
                )}

                <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow-md p-4 flex justify-between items-center">
                        <div className="container mx-auto flex justify-between items-center">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <div className="flex items-center gap-4">
                                {showChatBot && <div className="text-cyan-500">
                                    <Link to={`/customer-service/:${userId}`} className="flex items-center gap-2">
                                        <h1>Chat</h1>
                                        <i className="fa-solid fa-headset"></i>
                                    </Link>
                                </div>}
                                <div className="flex items-center" style={{ gap: "10px" }}>
                                    <h1>Hello, <span className="capitalize">{detail.name}</span></h1>
                                    <Dropdown detail={detail} content={this.props.content || this.content} onClick={this.handleDropdown} />
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto py-6 bg-gray-100 flex-1 mt-[6px]">
                        <div className="layout-component">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default withNavigate(Layout);
