import { Component } from "react";
import Layout from "../components/layout/layout";
import httpRequest from "../plugin/httpRequest";
import CardProduct from "../components/ui/Card";

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detailUser: {},
            allProduct: []
        }

        this.content = ['Profil', 'Pengaturan', 'Keluar'];
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
                avatar: getMe.avatar
            },
            allProduct: getAllProduct
        })
    }

    render() {
        return (
            <>
                <Layout title="User Dashboard" showSidebar={false} profile={true} detail={this.state.detailUser} content={this.content}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="flex flex-wrap gap-4">
                                {this.state.allProduct.map((item, index) => {
                                    return (
                                        <CardProduct 
                                            key={index}
                                            image={item.image[0]}
                                            price={item.price}
                                            productName={item.productName}
                                            stock={item.stock}
                                            id={item._id}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        );
    }
}

export default UserDashboard;