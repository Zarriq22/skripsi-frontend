import { Component } from "react";
import { withNavigate } from "../../../router/custom/withNavigate";

class ProfileUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "Nama Pengguna",
        email: "user@email.com",
        phone: "08123456789",
        avatar: "",
        addresses: [
          "Jalan Mawar No. 12, Jakarta",
          "Perumahan Melati Blok B2, Bandung"
        ]
      }
    };
  }

  handleAddAddress = () => {
    // TODO: Tambahkan modal / form untuk input alamat baru
    console.log("Tambah alamat baru");
  };

  handleEditAddress = (index) => {
    // TODO: Modal / inline edit
    console.log("Edit alamat ke-", index);
  };

  handleDeleteAddress = (index) => {
    const { user } = this.state;
    const newAddresses = [...user.addresses];
    newAddresses.splice(index, 1);
    this.setState({
      user: {
        ...user,
        addresses: newAddresses
      }
    });
  };

  handleChangePassword = () => {
    console.log("Ubah password");
  };

  handleLogout = () => {
    localStorage.clear();
    this.props.navigate("/login");
  };

  render() {
    const { user } = this.state;

    return (
      <div className="container-fluid">
        <div className="flex items-center space-x-4">
            <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
            />
            <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
        </div>

        <div className="mt-6 space-y-4">
            <div>
                <label className="text-gray-700 font-medium">Nomor HP</label>
                <p className="text-gray-800">{user.phone}</p>
            </div>

            <div>
                <label className="text-gray-700 font-medium">Daftar Alamat</label>
                <div className="space-y-2 mt-2">
                {user.addresses.map((addr, index) => (
                    <div
                    key={index}
                    className="p-3 border rounded flex justify-between items-start"
                    >
                    <p className="text-gray-700">{addr}</p>
                    <div className="space-x-2">
                        <button
                        onClick={() => this.handleEditAddress(index)}
                        className="text-blue-500 hover:underline text-sm"
                        >
                        Ubah
                        </button>
                        <button
                        onClick={() => this.handleDeleteAddress(index)}
                        className="text-red-500 hover:underline text-sm"
                        >
                        Hapus
                        </button>
                    </div>
                    </div>
                ))}
                <button
                    onClick={this.handleAddAddress}
                    className="mt-2 text-sm text-green-600 hover:underline"
                >
                    + Tambah Alamat
                </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <button
                onClick={this.handleChangePassword}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded"
                >
                Ubah Password
                </button>
                <button
                onClick={this.handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                >
                Logout
                </button>
            </div>
        </div>
      </div>
    );
  }
}

export default withNavigate(ProfileUser);
