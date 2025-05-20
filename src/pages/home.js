import React, { Component } from "react";
import { Link } from "react-router-dom";
import img from "../assets/avatar/logo.png"
import hero from "../assets/avatar/hero.png"
import Button from "../components/ui/Button";
import { withNavigate } from "../router/custom/withNavigate";
import CardProduct from "../components/ui/Card";
import { category } from "../plugin/lookup";
import httpRequest from "../plugin/httpRequest";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeMenu: "produk",
            openHumburger: false,
            openAcount: false,
            isScrolled: false,
            products: [],
        };

        this.menuRef = React.createRef();
        this.acountRef = React.createRef();
        this.buttonRef = React.createRef();
        this.buttonUserRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        document.addEventListener("mousedown", this.handleClickOutside);
        this.getProduct()
    }
    
    componentWillUnmount() {
        window.addEventListener("scroll", this.handleScroll);
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    getProduct = async () => {
        let getProduct = await httpRequest(process.env.REACT_APP_BASE_URL, `products`, 'GET')
        this.setState({ products: getProduct })
    }

    handleScroll = () => {
        const isScrolled = window.scrollY > 0;
        if (isScrolled !== this.state.isScrolled) {
            this.setState({ isScrolled });
        }
    };

    setActiveMenu = (menu) => {
        this.setState(prev => ({ 
            openHumburger: !prev.openHumburger,
            activeMenu: menu
        }));
    }

    openHumburger = () => {
        this.setState(prev => ({ openHumburger: !prev.openHumburger }));
    }

    handleClickOutside = (event) => {
        if (
            this.menuRef.current &&
            !this.menuRef.current.contains(event.target) &&
            this.buttonRef.current &&
            !this.buttonRef.current.contains(event.target)
        ) {
            this.setState({ openHumburger: false });
        }

        if (
            this.acountRef.current &&
            !this.acountRef.current.contains(event.target) &&
            this.buttonUserRef.current &&
            !this.buttonUserRef.current.contains(event.target)
        ) {
            this.setState({ openAcount: false });
        }
    };

    openAcount = () => {
        this.setState(prev => ({ openAcount: !prev.openAcount }));
    }

    getBuyProduct = () => {
        this.props.navigate('/login');
    }

    sendUrl = (url) => {
        window.open(url);
    }

    render() {
        const { activeMenu, openHumburger, openAcount, isScrolled, products } = this.state;

        const navItems = [
            { path: `#`, label: "Produk", key: "produk" },
            { path: `#`, label: "Produk Terbaru", key: "product-terbaru" },
            { path: `#`, label: "Penjualan", key: "penjualan" },
            { path: `#`, label: "Tentang Kami", key: "tentang-kami" },
        ];

        const secoundNav = [
            { path: "/login", label: "Masuk", key: "masuk" },
            { path: `/register`, label: "Daftar", key: "daftar" },
        ];

        const contactUs = [
            { path: `https://wa.me/6287720681873`, label: "Whatsapp", key: "whatsapp", icon: "fa-brands fa-whatsapp" },
            { path: `https://www.instagram.com/azharrafiq_sjn/`, label: "Instagram", key: "instagram", icon: "fa-brands fa-instagram" },
            { path: `https://www.youtube.com/@azharrafiqsjn22`, label: "Youtube", key: "youtube", icon: "fa-brands fa-youtube" },
            { path: `https://www.tiktok.com/@arrafiq7425`, label: "Tiktok", key: "tiktok", icon: "fa-brands fa-tiktok" },
        ];

        return (
            <>
                <div className="">
                    <article className="home-page" style={{ height: '100vh', width: '100%' }}>
                        <div className="section">
                            {/* First Section */}
                            <div className={`first-section py-[16px] px-[24px] ${isScrolled ? "backdrop-blur-md bg-white/30 shadow-md" : "bg-transparent"}`}>
                                <div className="container mx-auto flex items-center justify-between gap-4">
                                    <div className="humburger block md:hidden">
                                        <div>
                                            <button ref={this.buttonRef} className="cursor-pointer flex flex-col gap-1" onClick={() => this.openHumburger()}>
                                                <div className={`w-6 bg-black duration-300 transition-transform ease-in-out ${openHumburger ? 'rotate-45 translate-y-0.5 ' : ''}`} style={{ height: '2px' }}></div>
                                                <div className={`w-4 bg-black duration-300 transition-transform ease-in-out ${openHumburger ? 'hidden' : ''}`} style={{ height: '2px' }}></div>
                                                <div className={`w-6 bg-black duration-300 transition-transform ease-in-out ${openHumburger ? '-rotate-45 -translate-y-1' : ''}`} style={{ height: '2px' }}></div>
                                            </button>
                                        </div>
                                        <div ref={this.menuRef} className={`humburger-menu w-[200px] ${openHumburger ? 'block' : 'hidden'}`}>
                                            <ul className={`flex flex-col gap-2`}>
                                                {navItems.map(item => (
                                                    <Link to={item.path} key={item.key} className="mb-0">
                                                        <li className="home-list">
                                                            <Button
                                                                text={item.label}
                                                                cssClass={`rounded text-left w-full px-4 py-2 cursor-pointer 
                                                                    ${activeMenu === item.key ? 'bg-black text-white' : ''} hover:bg-black hover:text-white`}
                                                                onClick={() => this.setActiveMenu(item.key)}
                                                            />
                                                        </li>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <img src={img} alt="img" className="rounded-full" style={{ width: '60px', hieght: '60px' }} />
                                            <h2 className="text-2xl font-bold">Zarrion<i>F</i></h2>
                                        </div>
                                        <div className="hidden md:block">
                                            <ul className="space-y-2 flex gap-2">
                                                {navItems.map(item => (
                                                    <Link to={item.path} key={item.key} className="mb-0">
                                                        <li className="home-list">
                                                            <Button
                                                                text={item.label}
                                                                cssClass={`rounded text-left w-full px-4 py-2 cursor-pointer 
                                                                    ${activeMenu === item.key ? 'bg-black text-white' : ''} hover:bg-black hover:text-white`}
                                                                onClick={() => this.setActiveMenu(item.key)}
                                                            />
                                                        </li>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="acount">
                                            <div className="block md:hidden">
                                                <button ref={this.buttonUserRef} className="cursor-pointer flex flex-col gap-1" onClick={() => this.openAcount()}>
                                                    <i className="fa-solid fa-user"></i>
                                                </button>
                                            </div>
                                            <div ref={this.acountRef} className={`acount-menu w-[200px] ${openAcount ? 'block' : 'hidden'}`}>
                                                <ul className={`flex flex-col gap-2`}>
                                                    {secoundNav.map(item => (
                                                        <Link to={item.path} key={item.key} className="mb-0">
                                                            <li className="home-list">
                                                                <Button
                                                                    text={item.label}
                                                                    cssClass={`rounded text-left w-full px-4 py-2 cursor-pointer 
                                                                        ${activeMenu === item.key ? 'bg-black text-white' : ''} hover:bg-black hover:text-white`}
                                                                    onClick={() => this.setActiveMenu(item.key)}
                                                                />
                                                            </li>
                                                        </Link>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <ul className="space-y-2 flex">
                                                {secoundNav.map(item => (
                                                    <Link to={item.path} key={item.key} className="mb-0">
                                                        <li>
                                                            <Button
                                                                text={item.label}
                                                                cssClass={`rounded text-left w-full px-4 py-2 cursor-pointer 
                                                                    ${activeMenu === item.key ? 'bg-black text-white' : ''} hover:bg-black hover:text-white`}
                                                                onClick={() => this.setActiveMenu(item.key)}
                                                            />
                                                        </li>
                                                    </Link>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Section */}
                            <div id="product" className="second-section px-[24px]">
                                <div className="container mx-auto">
                                    <div className="mt-10 flex flex-col gap-4">
                                        <div>
                                            <img src={hero} alt="hero" className="w-full" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h1 className="text-3xl font-bold">Zarrion<i className="text-cyan-500">Fashion</i></h1>
                                            <p className="">Zarrion<i className="text-cyan-500">Fashion</i> adalah toko online yang menyediakan berbagai macam produk fashion dengan harga murah dan kualitas terbaik. Ayo jelajahi dan temukan produk kesukaanmu di toko kami sekarang!</p>
                                        </div>
                                        <div>
                                            <Button
                                                text="Belanja Sekarang"
                                                cssClass="bg-cyan-500 text-white rounded px-4 py-2 hover:bg-cyan-600"
                                                onClick={() => this.getBuyProduct()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third Section */}
                            <div id="product-terbaru" className="third-section px-[24px]">
                                <div className="container mx-auto">
                                    <div className="flex flex-col gap-4 mt-10">
                                        <div className="flex justify-between items-center w-full border-b-2 border-cyan-500">
                                            <span className="text-3xl font-bold">Produk Populer</span>
                                            <Button 
                                                text="Lihat Semua"
                                                cssClass="btn font-bold text-cyan-500 hover:text-cyan-600"
                                                onClick={() => this.getBuyProduct()}
                                            />
                                        </div>
                                        <div className="flex gap-4 overflow-x-scroll p-2">
                                            {products.length > 0 
                                                ? products.map(item => (
                                                <CardProduct
                                                    key={item._id}
                                                    image={item.image[0]}
                                                    price={item.price}
                                                    productName={item.productName}
                                                    stock={item.stock}
                                                    id={item._id}
                                                    wishList={item.wishList}
                                                    wishListId={item.wishListId}
                                                    addToWishlist={(data) => this.addWishlist(data)}
                                                />
                                            )) : <p>Tidak ada produk</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fourth Section */}
                            <div id="penjualan" className="fourth-section px-[24px] mt-10">
                                <div className="container mx-auto flex flex-col gap-4">
                                    <div className="w-full border-b-2 border-cyan-500">
                                        <span className="text-3xl font-bold text-center">Cara Order Di Toko Kami</span>
                                    </div>
                                    <div className="bg-cyan-500 p-4 rounded-4xl mt-4">
                                        <div className="flex flex-col gap-4 mt-4 justify-center">
                                            <div className="how-order justify-center">
                                                <span className="badge-number">
                                                    1
                                                </span>
                                                <span className="w-[30%] text-lg">
                                                    Pilih Produk
                                                </span>
                                                <span className="dashed-line"></span>
                                            </div>
                                            <div className="how-order justify-center">
                                                <span className="badge-number">
                                                    2
                                                </span>
                                                <span className="w-[30%] text-lg">
                                                    Masuk / Daftar
                                                </span>
                                                <span className="dashed-line"></span>
                                            </div>
                                            <div className="how-order justify-center">
                                                <span className="badge-number">
                                                    3
                                                </span>
                                                <span className="w-[30%] text-lg">
                                                    Lihat Keranjang
                                                </span>
                                                <span className="dashed-line"></span>
                                            </div>
                                            <div className="how-order justify-center">
                                                <span className="badge-number">
                                                    4
                                                </span>
                                                <span className="w-[30%] text-lg">
                                                    Checkout
                                                </span>
                                                <span className="dashed-line"></span>
                                            </div>
                                            <div className="how-order justify-center">
                                                <span className="badge-number">
                                                    5
                                                </span>
                                                <span className="w-[30%] text-lg">
                                                    Pembayaran
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fifth Section */}
                            <div id="tentang-kami" className="fifth-section px-[24px]">
                                <div className="container mx-auto">
                                    <div className="flex flex-col gap-4 mt-10 pb-10">
                                        <div className="flex items-center gap-2 w-full border-b-2 border-cyan-500">
                                            <img src={img} alt="img" className="rounded-full" style={{ width: '60px', hieght: '60px' }} />
                                            <h2 className="text-xl font-bold">Zarrion<i>F</i></h2>
                                        </div>
                                        <div>
                                            <p>Kami hadir sebagai toko online yang menyediakan berbagai macam produk berkualitas dengan harga terjangkau. Kami menyediakan berbagai macam produk berkualitas dengan harga terjangkau. </p>
                                        </div>
                                        <div className="flex flex-col gap-4 md:flex-row">
                                            <div className="">
                                                <div className="w-full border-b-2 border-cyan-500">
                                                    <span className="text-2xl font-bold">Kategori Produk</span>
                                                </div>
                                                <ul>
                                                    {category().map((item) => (
                                                        <li key={item.value}>{item.label}</li>
                                                    ))}
                                                    <li>Lainnya...</li>
                                                </ul>
                                            </div>
                                            <div className="">
                                                <div className="w-full border-b-2 border-cyan-500">
                                                    <span className="text-2xl font-bold">Kontak Kami</span>
                                                </div>
                                                <ul className="flex flex-col gap-2">
                                                    {contactUs.map((item) => (
                                                        <li key={item.label}>
                                                            <Button 
                                                                text={
                                                                    <div className="flex justify-start items-start gap-2">
                                                                        <div className="w-[25%]">
                                                                            <i className={`${item.icon}`}></i>
                                                                        </div>
                                                                        <span>{item.label}</span>
                                                                    </div>
                                                                } 
                                                                cssClass={`pl-0 hover:text-cyan-500 cursor-pointer w-[25%]`} 
                                                                onClick={() => this.sendUrl(item.path)}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </>
        );
    }
}

export default withNavigate(Home);