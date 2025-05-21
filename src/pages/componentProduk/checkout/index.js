import React, { Component } from "react";
import { withLocation } from "../../../router/custom/withLocation";
import httpRequest from "../../../plugin/httpRequest";
import { Link } from "react-router-dom";
import LoadingRequest from "../../../components/ui/loading";
import Button from "../../../components/ui/Button";
import ModalJasaPengiriman from "./modalPengiriman";
import { formatNumber } from "../../../plugin/helper";
import ModalAlamat from "./modalAlamat";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      note: "",
      address: "",
      shippingOption: "",
      serviceFee: 2000,
      shippingCost: 0,
      loadingRequest: false,
      totalPrice: 0,
      quantity: 1
    };

    this.showModalPengirimanRef = React.createRef();
    this.showModalAlamatRef = React.createRef();
  }

  checkout = async () => {
    const { product, note, serviceFee, shippingCost } = this.state;

    this.setState({ loadingRequest: true });
    try {
      await httpRequest(process.env.REACT_APP_BASE_URL, "pesanan", "POST", {
        values: {
          productName: product.productName,
          productId: product._id,
          userId: product.userId,
          price: product.price,
          image: product.image,
          description: product.description,
          status: 1,
          note: note,
          serviceFee: serviceFee,
          shippingCost: shippingCost,
        },
      });

      this.setState({ loadingRequest: false });
      this.props.history.push("/pesanan-saya");
    } catch (e) {
      this.setState({ loadingRequest: false });
      alert("Gagal membuat pesanan");
    }
  };

  handleNoteChange = (e) => {
    this.setState({ note: e.target.value });
  };

  showModal = (type) => {
    if (type === "pengiriman") {
      this.showModalPengirimanRef.current.showModal();
    } else {
      this.showModalAlamatRef.current.showModal();
    }
  };

  handlePengirimanSelect = (options) => {
    this.setState({
      shippingOption:
        options.name +
        " (" +
        formatNumber(options.cost) +
        ") " +
        options.estimasi,
      shippingCost: options.cost,
    });
  };

  handleSelectedAddress = (addr) => {
    this.setState({ address: addr });
  };

  incrementQuantity = () => {
    this.setState({
      quantity: this.state.quantity + 1
    })
  }

  decrementQuantity = () => {
    console.log('tes')
    if (this.state.quantity === 1) return
    this.setState({
      quantity: this.state.quantity - 1
    })
  }

  render() {
    const { state } = this.props.location;
    const product = state?.product;
    const {
      note,
      address,
      shippingOption,
      serviceFee,
      shippingCost,
      loadingRequest,
      quantity,
    } = this.state;

    if (!product) {
      return <div className="p-4">Data produk tidak ditemukan!</div>;
    }

    const subtotal = product.price * quantity;
    const total = subtotal + serviceFee + shippingCost;

    return (
      <div className="container-fluid relative flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link to={`/detail-product/${product.productId}`} className="cursor-pointer">
            <i className="fas fa-arrow-left text-cyan-500 text-2xl"></i>
          </Link>
          <h1 className="text-2xl font-semibold">Checkout</h1>
        </div>

        {/* Alamat */}
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium mb-2">Alamat Pengiriman</h2>
            <Button
              text={address ? "Ubah Alamat" : "Pilih Alamat"}
              onClick={() => this.showModal("alamat")}
              cssClass="btn-default text-sm"
            />
          </div>
          <p>{address}</p>
        </div>

        {/* Detail Produk */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-medium mb-2">Detail Produk</h2>
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.productName}
              className="w-20 h-20 rounded"
            />
            <div className="w-full">
              <div>
                <p className="font-semibold">{product.productName}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Harga: Rp {formatNumber(subtotal)}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <button className="bg-gray-200 w-[20px] rounded hover:bg-gray-300 cursor-pointer text-center font-bold" onClick={() => this.decrementQuantity()}>
                    <i className="fas fa-minus"></i>
                  </button>
                  <span>{quantity || 0}</span>
                  <button className="bg-gray-200 w-[20px] rounded hover:bg-gray-300 cursor-pointer text-center font-bold" onClick={() => this.incrementQuantity()}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jasa Pengiriman */}
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium mb-2">Jasa Pengiriman</h2>
            <Button
              text="Jasa Pengiriman"
              onClick={() => this.showModal("pengiriman")}
              cssClass="btn-default text-sm"
            />
          </div>
          <p>{shippingOption}</p>
        </div>

        {/* Catatan */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-medium mb-2">Catatan untuk Penjual</h2>
          <textarea
            value={note}
            onChange={this.handleNoteChange}
            placeholder="Tulis catatan untuk penjual..."
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        {/* Rincian Pembayaran */}
        <div className="bg-white p-4 rounded shadow-md space-y-2">
          <h2 className="text-lg font-medium">Rincian Pembayaran</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {formatNumber(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Biaya Layanan</span>
            <span>Rp {formatNumber(serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkos Kirim</span>
            <span>Rp {formatNumber(shippingCost)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {formatNumber(total)}</span>
          </div>
        </div>

        {/* Tombol */}
        <div className="text-center">
          <button
            onClick={this.checkout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            disabled={loadingRequest}
          >
            {loadingRequest ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>

        <ModalJasaPengiriman
          ref={this.showModalPengirimanRef}
          onSelect={this.handlePengirimanSelect}
        />
        <ModalAlamat
          ref={this.showModalAlamatRef}
          onSelect={this.handleSelectedAddress}
        />

        {loadingRequest && <LoadingRequest />}
      </div>
    );
  }
}

export default withLocation(Checkout);
