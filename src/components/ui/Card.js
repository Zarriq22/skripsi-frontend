import { Link } from "react-router-dom"
import { formatNumber, generateImage } from "../../plugin/helper"
import Button from "./Button"

function CardProduct ({ image, price, productName, stock, id, wishList, wishListId, addToWishlist }) {
    return (
        <div className="card-product h-full border border-gray-200 rounded-md" style={{ position: 'relative'}}>
            <Link to={`/detail-product/${id}`} className="btn p-0">
                <div className="w-full bg-white rounded-md shadow p-2 flex flex-col justify-between hover:shadow-lg">
                    {/* Gambar */}
                    <div className="w-full h-[130px] bg-gray-100 rounded overflow-hidden">
                        <img 
                            src={generateImage(image.path)} 
                            alt={image.filename} 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Konten */}
                    <div className="flex flex-col justify-between flex-1">
                        {/* Nama Produk (tinggi tetap) */}
                        <div className="h-[40px]">
                            <h5 className="text-sm font-medium leading-tight mt-2 mb-1 line-clamp-2">
                                {productName}
                            </h5>
                        </div>

                        {/* Harga dan stok - selalu di bawah */}
                        <div className="mt-auto">
                            <div className="text-red-600 font-semibold text-sm">
                                Rp{formatNumber(price)}
                            </div>
                            <div className="text-gray-500 text-xs">
                                Stok: {stock}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="absolute" style={{ top: '1%', right: '0%' }}>
                <Button 
                    text={<i className={`${wishList === true ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} hover:text-red-500`} style={{ fontSize: '20px' }}></i>}
                    cssClass="btn"
                    onClick={() => wishList === true ? addToWishlist({ image, price, productName, stock, id, updateWishList: false, wishListId: null }) : addToWishlist({ image, price, productName, stock, id, updateWishList: true, wishListId })}
                />
            </div>
        </div>
    )
}

export default CardProduct