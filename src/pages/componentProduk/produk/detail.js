import { Component } from "react";
import httpRequest from "../../../plugin/httpRequest";
// import { Link } from "react-router-dom";
import alert from "../../../components/ui/Alert";
import RatingStars from "../../../components/ui/Rating";

class DetailProduk extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            product: {},
            activeImage: ''
        }
    }

    componentWillMount = async () => {
        let path = window.location.pathname
        let paths = path.split('/')
        let lastUrl = paths[paths.length - 1]
        
        if (lastUrl) {
            await this.getAllData(lastUrl)
        }
    }

    getAllData = async (id) => {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let getMe = await httpRequest(process.env.REACT_APP_BASE_URL, `users/${userData.user.id}`, 'GET')
        let getProduct = await httpRequest(process.env.REACT_APP_BASE_URL, `products/${id}`, 'GET')

        this.setState({
            detailUser: {
                userId: getMe._id
            },
            product: getProduct,
            activeImage: getProduct.image?.[0] || ''
        })
    }

    handleThumbnailClick = (img) => {
        this.setState({ 
            activeImage: img 
        });
    }

    handleAddToCart = async() => {
        const { detailUser, product, activeImage } = this.state;
        const cartProduct = {
            userId: detailUser.userId,
            products: {
                productId: product._id,
                productName: product.productName,
                price: product.price,
                quantity: 1,
                image: activeImage,
                description: product.description,
            }
        }

        // Simulasi tambah ke keranjang belanja
        try {
            const response = await httpRequest(process.env.REACT_APP_BASE_URL, 'carts', 'POST', {
                values: cartProduct
            });

            if (response) {
                alert('Produk berhasil ditambahkan ke keranjang belanja', 'Informasi');
            }
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan saat menambahkan produk ke keranjang belanja', 'Informasi');
        }
    }
    
    handleBuyNow = () => {
        const { product } = this.state;
    
        // Simulasi langsung beli
        alert(`Menuju halaman pembelian untuk: ${product.productName}`);
        // Bisa arahkan ke halaman checkout:
        // this.props.history.push(`/checkout/${product._id}`)
    }

    render() {
        const { product, activeImage  } = this.state
        return (
            <div className="container-fluid">
                <div className="row">
                    {/* <div className="col-md-12 mb-3" style={{ display: 'flex', justifyContent: 'end' }}>
                        <Link to="/user-dashboard" className="btn btn-primary">Kembali</Link>
                    </div> */}
                    <div className="flex flex-col gap-6">
                        <div className="">
                            <div className="border rounded p-3 text-center">
                                {product.image && product.image[0] ? (
                                    <img 
                                        src={activeImage} 
                                        alt="Product" 
                                        className="img-fluid rounded" 
                                    />
                                ) : (
                                    <p>Gambar tidak tersedia</p>
                                )}
                            </div>
                            
                            <div className="flex gap-2 mt-3 justify-center flex-wrap">
                                {product.image?.map((img, i) => (
                                    <img 
                                        key={i}
                                        src={img}
                                        alt={`Thumb-${i}`}
                                        onClick={() => this.handleThumbnailClick(img)}
                                        style={{ 
                                            width: 80, 
                                            height: 80, 
                                            cursor: 'pointer',
                                            border: img === activeImage ? '2px solid #007bff' : '1px solid #ccc',
                                            borderRadius: 5,
                                            objectFit: 'cover'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div >
                                <div>
                                    <h2>{product.productName}</h2>
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={product.rating || 5} />
                                        <span className="penilaian"><u>{product.rating}</u> Penilaian</span>
                                        <span className="terjual">{product.terjual} Terjual</span>
                                    </div>
                                </div>
                                <div className="bg-cyan-100 p-2 rounded">
                                    <h4 className="text-success">Rp {product.price?.toLocaleString()}</h4>
                                </div>
                                {/* <p className="mt-3">{product.description}</p> */}
                                {/* <p><strong>Kategori:</strong>{kategori.find(cat => cat.value === product.kategori)?.label}</p> */}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button 
                                    className="btn bg-cyan-200"
                                    onClick={() => this.handleAddToCart()}
                                >
                                    <i className="fa fa-shopping-cart mr-2"></i>
                                    Masukkan Keranjang
                                </button>

                                <button 
                                    className="btn btn-success"
                                    onClick={() => this.handleBuyNow()}
                                >
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailProduk