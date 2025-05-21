import React, { Component } from "react";
import httpRequest from "../plugin/httpRequest";
import CardProduct from "../components/ui/Card";
import { Link } from "react-router-dom";
import alert from "../components/ui/Alert";
import Loading from "../components/ui/LoadingPanel";

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detailUser: {},
            allProduct: [],
            allKeranjang: [],
            filteredProduct: [],
            searchKeyword: '',
            showChatbot: false,
            chatbotMessages: [],
            chatbotInput: '',
            showLoadingChat: false,
            loading: false
        }

        this.chatBotBoxRef = React.createRef();
    }

    componentWillMount() {
        this.getAllData()
    }

    getAllData = async () => {
        this.setState({ loading: true })
        let userData = JSON.parse(localStorage.getItem('userData'))
        try {
            let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
            let getAllProduct = await httpRequest(process.env.REACT_APP_BASE_URL, `products`, 'GET')
            let getKeranjang = await httpRequest(process.env.REACT_APP_BASE_URL, `carts/user/${getMe._id}`, 'GET')
    
            this.setState({
                detailUser: {
                    name: getMe.initialName,
                    avatar: getMe.avatar,
                    id: getMe._id
                },
                allProduct: getAllProduct,
                filteredProduct: getAllProduct,
                allKeranjang: getKeranjang,
                loading: false
            })
        } catch (e) {
            this.setState({ loading: false })
            alert('Gagal mendapatkan data', 'Informasi')
        }
    }

    handleSearchChange = (e) => {
        const keyword = e.target.value;
        this.setState({ searchKeyword: keyword });

        // Kalau input kosong, langsung tampilkan semua produk
        if (keyword.trim() === '') {
            this.setState({ filteredProduct: this.state.allProduct });
        }
    }

    filterProducts = () => {
        const { allProduct, searchKeyword } = this.state;
        
        if (!searchKeyword) {
            this.setState({ filteredProduct: allProduct });
            return;
        }

        const filtered = allProduct.filter(product => 
            product.productName.toLowerCase().includes(searchKeyword) ||
            (product.description && product.description.toLowerCase().includes(searchKeyword))
        );

        this.setState({ filteredProduct: filtered });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.filterProducts();
        }
    }

    showChatbot = () => {
        this.chatBotBoxRef.current.showChatbot()
    }

    addWishlist = async (data) => {
        const dataUpdate = {
            ...data,
            wishList: data.updateWishList,
            wishListId: data.updateWishList === true ? this.state.detailUser.id : null
        }

        if (data.id) {
            await httpRequest(process.env.REACT_APP_BASE_URL, `products/${data.id}`, 'PUT', {
                values: dataUpdate
            })
            this.getAllData()
        }
    }

    render() {
        const id = this.state.detailUser.id

        if (this.state.loading) {
            return <Loading />
        }
        return (
            <>
                <div className="container-fluid">
                    <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px 16px 24px', backgroundColor: 'rgb(219 219 219)', borderRadius: '12px' }}>
                        <div>
                            <div className="relative">
                                <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder={`Cari produk...`}
                                    value={this.state.searchKeyword}
                                    onChange={this.handleSearchChange}
                                    onKeyDown={this.handleKeyDown}
                                    className="w-full pl-4 pr-2 py-1 border rounded form-input"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <Link to={`/keranjang/${id}`}>
                                    <i className="fa-solid fa-cart-shopping" style={{ fontSize: '30px' }}></i>
                                    <span className="absolute bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs" style={{ top: '-20%', right: '-20%' }}>{this.state.allKeranjang.length}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" style={{ padding: '8px 16px 24px 16px', gap: '24px' }}>
                            {this.state.filteredProduct.map((item, index) => {
                                return (
                                    <CardProduct 
                                        key={index}
                                        image={item.image}
                                        price={item.price}
                                        productName={item.productName}
                                        stock={item.stock}
                                        id={item._id}
                                        wishList={item.wishList}
                                        wishListId={item.wishListId}
                                        addToWishlist={(data) => this.addWishlist(data)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default UserDashboard;