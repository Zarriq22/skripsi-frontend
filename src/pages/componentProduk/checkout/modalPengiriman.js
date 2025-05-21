import { Component } from "react";
import { formatNumber } from "../../../plugin/helper";

class ModalJasaPengiriman extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selectedOption: null,
    };
  }

  showModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  handleSelect = (option) => {
    this.setState({ selectedOption: option, show: false });
    this.props.onSelect(option); // kirim ke parent
  };

  render() {
    const options = [
      { name: "JNE", cost: 10000, estimasi: "2 - 3 hari sampai" },
      { name: "J&T", cost: 12000, estimasi: "1 - 2 hari sampai" },
    ];

    const { show, selectedOption } = this.state;

    if (!show) return null;

    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pilih Jasa Pengiriman</h2>
            <button
              onClick={this.closeModal}
              className="text-gray-500 hover:text-black"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center justify-between border p-3 rounded cursor-pointer ${
                  selectedOption?.name === option.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => this.handleSelect(option)}
              >
                <div>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-gray-500">
                    Ongkir: Rp {formatNumber(option.cost)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Estiamasi sampai {option.estimasi}
                  </p>
                </div>
                <input
                  type="radio"
                  checked={selectedOption?.name === option.name}
                  readOnly
                  className="w-4 h-4"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ModalJasaPengiriman;
