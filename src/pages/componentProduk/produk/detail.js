import { Component } from "react";
import Layout from "../../../components/layout/layout";
import httpRequest from "../../../plugin/httpRequest";

class DetailProduk extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            detailUser: {},
            product: []
        }

        this.content = ['Profil', 'Pengaturan', 'Keluar'];
    }

    componentWillMount() {
        let path = window.location.pathname
        let paths = path.split('/')
        let lastUrl = paths[paths.length - 1]
        
        if (lastUrl) {
            this.getAllData(lastUrl)
        }
    }

    getAllData = async (id) => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        let getProduct = await httpRequest(process.env.REACT_APP_BASE_URL, `products/${id}`, 'GET')

        this.setState({
            detailUser: {
                name: getMe.initialName,
                avatar: getMe.avatar
            },
            product: [getProduct]
        })
    }

    render() {
        const { product } = this.state
        return (
            <Layout title="Detail Produk" showSidebar={false} profile={true} detail={this.state.detailUser} content={this.content}>
                <div className="container-fluid">
                        <div className="row">
                            {product.map((product, index) => {
                                return (
                                    <div className="col-md-6">
                                        <h2>{product.name}</h2>
                                        <h4 className="text-success">Rp {product.price?.toLocaleString()}</h4>
                                        <p>{product.description}</p>
                                        <p><strong>Kategori:</strong> {product.category}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            </Layout>
        );
    }
}

export default DetailProduk