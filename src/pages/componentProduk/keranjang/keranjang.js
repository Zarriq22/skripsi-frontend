import React, { Component } from "react";
import Cart from "../../../components/ui/Cart";
import httpRequest from "../../../plugin/httpRequest";
import { formatNumber } from "../../../plugin/helper";
import Loading from "../../../components/ui/LoadingPanel";
import { withNavigate } from "../../../router/custom/withNavigate";
import Button from "../../../components/ui/Button";

class Keranjang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataKeranjang: [],
            selectedProducts: [], // <== ini buat nyimpan yang dicentang
            totalPrice: 0,
            loading: true
        }

        this.cartRef = React.createRef();
    }

    async componentDidMount() {
        let path = window.location.pathname
        let paths = path.split('/')
        let lastUrl = paths[paths.length - 1]
        
        if (lastUrl) {
            await this.getCart(lastUrl)
        }
    }

    getCart = async (id) => {
        this.setState({ loading: true })
        let getKeranjang = await httpRequest(process.env.REACT_APP_BASE_URL, `carts/user/${id}`, 'GET')
        this.setState({
            dataKeranjang: getKeranjang,
            loading: false
        })

    }

    handleCheckboxChange = (itemId) => {
        this.setState(prevState => {
            const selectedProducts = prevState.selectedProducts.includes(itemId)
                ? prevState.selectedProducts.filter(id => id !== itemId) // Uncheck
                : [...prevState.selectedProducts, itemId]; // Check
            const totalPrice = prevState.dataKeranjang.reduce((total, item) => {
                if (selectedProducts.includes(item._id)) {
                    const price = item.products[0].price || 0;
                    const quantity = item.products[0].quantity || 1;
                    return total + (price * quantity);
                }
                return total;
            }, 0);
            return { selectedProducts, totalPrice };
        });
    }

    handleCheckout = () => {
        const { selectedProducts, dataKeranjang } = this.state;
        const { navigate } = this.props

        // Cari item yang dipilih
        const selectedItems = dataKeranjang.filter(item => selectedProducts.includes(item._id));
        const dataProduct = []

        // Kirim ke halaman checkout, atau tampilkan console dulu
        for (let val of selectedItems) {
            dataProduct.push({
                productName: val.products[0].productName,
                productId: val.products[0]._id,
                userId: val.userId,
                price: val.products[0].price,
                image: val.products[0].image,
                description: val.products[0].description,
            })
        }

        navigate('/checkout', { state: { product: dataProduct } });
    }

    deleteCart = async (id) => {
        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, `carts/${id}`, 'DELETE')

            this.componentDidMount()
        } catch (e) {
            console.log(e)
        }
    }

    handleEditCart = async (updatedItem) => {
        const dataUpdate = {
            ...updatedItem,
            products: [
                {
                    ...updatedItem.products[0],
                    quantity: updatedItem.quantity
                }
            ]
        }

        try {
            await httpRequest(process.env.REACT_APP_BASE_URL, `carts/${updatedItem._id}`, 'PUT', {
                values: dataUpdate,
            })
        } catch (e) {
            
        }
    };

    render() { 
        const { dataKeranjang, selectedProducts, totalPrice, loading } = this.state;

        return ( 
            <div className="container-fluid">
                {/* <div className="row">
                    <div className="col-md-12">
                        <input 
                            type="text"
                            className="form-control"
                            placeholder="Cari produk..."
                            style={{ width: '100%' }}
                        />
                    </div>
                </div> */}
                <div style={{ height: 'calc(100vh - 230px)' }} className="flex flex-col gap-[24px] overflow-y-scroll">
                    {dataKeranjang.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(item._id)}
                                onChange={() => this.handleCheckboxChange(item._id)}
                                style={{ width: '20px', height: '20px' }}
                            />

                            {/* Komponen Cart */}
                            <Cart
                                ref={this.cartRef}
                                item={item}
                                handleCheckboxChange={this.handleCheckboxChange}
                                quantity={item.products[0].quantity}
                                price={item.products[0].price}
                                handleDelete={() => this.deleteCart(item._id)}
                                onSaveEdit={(updatedItem) => this.handleEditCart(updatedItem)}
                            />
                        </div>
                    ))}
                </div>

                {/* Tombol Checkout */}
                
                <div className="container mx-auto">
                    <div className="h-[45px] w-full relative flex justify-between items-center">
                        <div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Total Harga: </span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp{formatNumber(totalPrice)}</span>
                        </div>
                        <div>
                            {selectedProducts && (
                                <Button text={`Checkout ${selectedProducts.length} item`} cssClass="btn btn-primary" onClick={this.handleCheckout} />
                            )}
                        </div>
                    </div>
                </div>

                {loading && <Loading />}
            </div>
        );
    }
}

export default withNavigate(Keranjang);