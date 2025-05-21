import React,{ Component } from "react";
import httpRequest from "../../../plugin/httpRequest";
import SemuaStatus from "./status/semuaStatus";

class PesananSaya extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusPesanan: 'Semua Status',
            isDropdownOpen: false,
            pesananProduk: [],
        };
        this.dropdownRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.getPesananProduk();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ isDropdownOpen: false });
        }
    };

    statusOptions = [
        { value: 'Semua Status', label: 'Semua Status' },
        { value: 'dikemas', label: 'Dikemas' },
        { value: 'dikirim', label: 'Dikirim' },
        { value: 'selesai', label: 'Selesai' },
        { value: 'dibatalkan', label: 'Dibatalkan' }
    ];

    toggleDropdown = () => {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };

    handleStatusChange = (status) => {
        this.setState({
            statusPesanan: status,
            isDropdownOpen: false
        });
    };

    getPesananProduk = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData.user.id
        try {
            const res = await httpRequest(process.env.REACT_APP_BASE_URL, `pesanan/${userId}`, 'GET');

            if (res) {
                this.setState({
                    pesananProduk: res
                })
            }
        } catch (e) {
            
        }
    }

    renderElement = (status) => {
        const { pesananProduk } = this.state;
        return (
            <div className="w-full">
                <SemuaStatus 
                    data={pesananProduk}
                    filterStatus={status}
                />
            </div>
        )
    }

    render() {
        const { statusPesanan, isDropdownOpen } = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="w-full font-bold text-xl border-b border-gray-400 mb-2">
                        <h1>Daftar & Status Pesanan</h1>
                    </div>
                    
                    <div ref={this.dropdownRef} className="w-full">
                        <div className="w-full relative md:hidden">
                            {/* Dropdown Trigger */}
                            <div 
                                className="button-status w-full border-2 border-gray-400 rounded p-2 mb-1 flex justify-between items-center cursor-pointer"
                                onClick={this.toggleDropdown}
                                role="button"
                                tabIndex="0"
                                aria-haspopup="listbox"
                                aria-expanded={isDropdownOpen}
                            >
                                <span className="capitalize">{statusPesanan}</span>
                                <i className={`fa-solid fa-angle-down transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}></i>
                            </div>
                            
                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div 
                                    className="content-status absolute w-full border-2 border-gray-400 rounded p-2 flex flex-col gap-1 bg-white z-10 shadow-md"
                                    role="listbox"
                                >
                                    {this.statusOptions.map((option) => (
                                        <div 
                                            key={option.value}
                                            className={`w-full p-2 hover:bg-gray-200 cursor-pointer rounded ${
                                                statusPesanan === option.value ? 'bg-gray-100 font-medium' : ''
                                            }`}
                                            onClick={() => this.handleStatusChange(option.value)}
                                            role="option"
                                            aria-selected={statusPesanan === option.value}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full hidden md:block">
                            <div className="w-full border-2 border-gray-400 rounded p-2 flex gap-1 bg-white z-10 shadow-md">
                                {this.statusOptions.map((option) => (
                                    <div 
                                        key={option.value}
                                        className={`w-full p-2 hover:bg-gray-200 cursor-pointer rounded ${
                                            statusPesanan === option.value ? 'bg-gray-200 font-medium' : ''
                                        }`}
                                        onClick={() => this.handleStatusChange(option.value)}
                                        role="option"
                                        aria-selected={statusPesanan === option.value}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full">
                            {this.renderElement(this.state.statusPesanan)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PesananSaya;