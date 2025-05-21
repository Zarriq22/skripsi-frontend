import { Component } from "react";
import httpRequest from "../../../plugin/httpRequest";
import alert from "../../../components/ui/Alert";

class ModalAlamat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            selected: null,
            newAddress: "",
            addressList: [],
            editingIndex: null,
            editValue: "",
        };

        this.userData = JSON.parse(localStorage.getItem("userData"));
    }

    showModal = async () => {
        this.setState({ 
            show: true
        });
        this.getAlamat();
    };

    closeModal = () => {
        this.setState({ show: false });
    };

    getAlamat = async () => {
        try {
            const res = await httpRequest(process.env.REACT_APP_BASE_URL, 'address', "GET");

            for (let val of res) {
                if (val.userId === this.userData.user.id) {
                    this.setState({ addressList: [val.address] });
                }
            }
        } catch (e) {
            
        }
    }

    handleAddAddress = async () => {
        const { newAddress } = this.state;
        if (newAddress.trim() === "") return;

        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, 'address', 'POST', {
                values: {
                    userId: this.userData.user.id,
                    alamat : newAddress
                }
            });

            this.getAlamat();
        } catch (e) {
            alert('Gagal menambahkan alamat', 'Informasi');
        }
    };

    handleDelete = async (index) => {
        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, `address/addressId/${index}`, 'DELETEBODY', {
                values: {
                    userId: this.userData.user.id
                }
            });

            this.getAlamat();
        } catch (e) {
            alert('Gagal menghapus alamat', 'Informasi');
        }
    };

    handleEdit = (index, addr) => {
        this.setState({ editingIndex: index, editValue: addr.alamat, editId: addr.id });
    };

    handleSaveEdit = async () => {
        const { editValue, editId } = this.state;
        const data = {
            alamatBaru: editValue,
            userId: this.userData.user.id
        }

        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, `address/${editId}`, 'PUT', {
                values: data,
            })
            this.getAlamat();
            this.setState({ editingIndex: null });
        } catch (e) {
            
        }
    };

    handleSelect = (addr) => {
        this.setState({ selected: addr, show: false });
        this.props.onSelect(addr); // kirim ke parent
    };

    render() {
        const { show, selected, addressList, newAddress, editingIndex, editValue } = this.state;

        if (!show) return null;

        const listAlamat = [];

        for (let val of addressList) {
            for (let v of val) {
                listAlamat.push({
                    alamat: v.alamat,
                    id: v._id
                })
            }
        }

        return (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white w-full max-w-md rounded p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Pilih Alamat</h2>
                        <button
                            onClick={this.closeModal}
                            className="text-gray-500 hover:text-black"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                        {listAlamat.length === 0 && (
                            <p className="text-sm text-gray-400">Belum ada alamat</p>
                        )}
                        {listAlamat.map((addr, i) => (
                            <div
                                key={i}
                                className={`border p-2 rounded ${
                                selected === addr.alamat
                                    ? "bg-blue-100 border-blue-500"
                                    : "border-gray-300"
                                }`}
                            >
                                {editingIndex === i ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) =>
                                                this.setState({ editValue: e.target.value })
                                            }
                                            className="w-full border p-1 rounded"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={this.handleSaveEdit}
                                                className="text-green-600 text-sm"
                                            >
                                                Simpan
                                            </button>
                                            <button
                                                onClick={() => this.setState({ editingIndex: null })}
                                                className="text-gray-500 text-sm"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                    ) : (
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => this.handleSelect(addr.alamat)}
                                        >
                                            {addr.alamat}
                                        </div>
                                        <div className="flex gap-2 ml-2 text-sm">
                                            <button
                                                onClick={() => this.handleEdit(i, addr)}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                Ubah
                                            </button>
                                            <button
                                                onClick={() => this.handleDelete(addr.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-1">Tambah Alamat Baru:</p>
                        <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => this.setState({ newAddress: e.target.value })}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Contoh: Jl. Mawar No. 123"
                        />
                        <button
                            onClick={this.handleAddAddress}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Tambah Alamat
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalAlamat;
