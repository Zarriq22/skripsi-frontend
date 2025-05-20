import React, { Component } from "react";
import Cart from "../../../components/ui/Cart";
import httpRequest from "../../../plugin/httpRequest";
import { formatNumber } from "../../../plugin/helper";
import { Link } from "react-router-dom";

class Keranjang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataKeranjang: [],
            selectedProducts: [], // <== ini buat nyimpan yang dicentang
            totalPrice: 0
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
        let getKeranjang = await httpRequest(process.env.REACT_APP_BASE_URL, `carts/user/${id}`, 'GET')
        this.setState({
            dataKeranjang: getKeranjang
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

        // Cari item yang dipilih
        const selectedItems = dataKeranjang.filter(item => selectedProducts.includes(item._id));

        // Kirim ke halaman checkout, atau tampilkan console dulu
        console.log("Checkout items:", selectedItems);

        // contoh redirect dengan data terpilih
        // this.props.history.push('/checkout', { selectedItems });
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
        const { dataKeranjang, selectedProducts, totalPrice } = this.state;

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
                <div className="col-md-12" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '5%' }}>
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
                
                <div 
                    className="container mx-auto" 
                    style={{
                        position: 'fixed',
                        bottom: '2.7%',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        padding: '10px 20px',
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1000,
                        width: '77.5vw',
                        borderBottomLeftRadius: '25px',
                        borderBottomRightRadius: '25px'
                    }}>
                    <div className="h-100 w-100 relative flex justify-between items-center">
                        <div>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Total Harga: </span>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp{formatNumber(totalPrice)}</span>
                        </div>
                        <div>
                            {selectedProducts.length > 0 && (
                                <Link to="/checkout" className="btn btn-primary" onClick={this.handleCheckout}>
                                    Checkout {selectedProducts.length} item
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Keranjang;