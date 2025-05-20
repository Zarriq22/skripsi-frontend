import React, { Component } from "react";
import CardProduct from "../../../components/ui/Card";
import httpRequest from "../../../plugin/httpRequest";

class ProductFavorite extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detailUser: {},
            allProduct: [],
        }

        this.chatBotBoxRef = React.createRef();
    }

    componentWillMount() {
        this.getAllData()
    }

    getAllData = async () => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        let getAllProduct = await httpRequest(process.env.REACT_APP_BASE_URL, `products`, 'GET')

        this.setState({
            detailUser: {
                name: getMe.initialName,
                avatar: getMe.avatar,
                id: getMe._id
            },
            allProduct: getAllProduct.filter(val => val.wishList === true),
        })
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
        return (
            <div className="container-fluid">
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" style={{ padding: '8px 16px 24px 16px', gap: '24px' }}>
                        {this.state.allProduct.map((item, index) => {
                            return (
                                <CardProduct 
                                    key={index}
                                    image={item.image[0]}
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
        );
    }
}

export default ProductFavorite;