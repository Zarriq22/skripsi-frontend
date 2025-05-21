import { Component } from "react";
import httpRequest from "../../../plugin/httpRequest";
// import { Link } from "react-router-dom";
import alert from "../../../components/ui/Alert";
import RatingStars from "../../../components/ui/Rating";
import { withNavigate } from "../../../router/custom/withNavigate";
import { Link } from "react-router-dom";
import { formatNumber } from "../../../plugin/helper";


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
        const { detailUser, product } = this.state;
        const { navigate } = this.props;
        const productData = {
            productName: product.productName,
            productId: product._id,
            userId: detailUser.userId,
            price: product.price,
            image: product.image[0],
            description: product.description,
        };

        navigate('/checkout', { state: { product: productData } });
    }

    render() {
        const { product, activeImage  } = this.state
        const userData = JSON.parse(localStorage.getItem('userData'));
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="mb-3">
                        <Link to="/dashboard-product" className="cursor-pointer">
                            <i className="fas fa-arrow-left text-cyan-500 text-2xl"></i>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="rounded p-3 text-center h-[75%] w-[75%]">
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
                                <div className="flex flex-col gap-3">
                                    <h2 className="font-bold text-3xl">Nike Air Max Dia SE</h2>
                                    <h4 className="font-medium text-xl">Rp {formatNumber(product.price)}</h4>
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={product.rating || 0} />
                                        <span className="penilaian"><u>{product.rating}</u> Penilaian</span>
                                        <span className="terjual">{product.terjual} Terjual</span>
                                    </div>
                                </div>
                                {/* <p className="mt-3">{product.description}</p> */}
                                {/* <p><strong>Kategori:</strong>{kategori.find(cat => cat.value === product.kategori)?.label}</p> */}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="btn bg-cyan-200"
                                        onClick={() => this.handleAddToCart()}
                                    >
                                        Masukkan Keranjang
                                    </button>

                                    <button 
                                        className="btn btn-success"
                                        onClick={() => this.handleBuyNow()}
                                    >
                                        Beli Sekarang
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <Link to={`/customer-service/${userData.user.id}?productId=${product._id}`} className="btn btn-warning text-center">
                                        <i className="fa fa-comments mr-2"></i>
                                    </Link>
                                </div>
                            </div>
                            <hr />
                            <div className="flex flex-col gap-3">
                                <div>
                                    <h2 className="font-bold text-2xl">Deskripsi Produk</h2>
                                    <p className="mt-3">{product.description}</p>
                                </div>
                                <div>
                                    <h2 className="font-bold text-2xl">Spesifikasi</h2>
                                    <p className="mt-3">{product.spesifikasi || 'Spesifikasi tidak tersedia'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigate(DetailProduk)