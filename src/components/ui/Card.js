import { Link } from "react-router-dom"
import { formatNumber } from "../../plugin/helper"
import Button from "./Button"

function CardProduct ({ image, price, productName, stock, id, wishList, wishListId, addToWishlist }) {
    return (
        <div className="card-product" style={{ position: 'relative'}}>
            <Link to={`/detail-product/${id}`} className="btn p-0">
                <div className="card pt-4">
                    <div className="card-header">
                        <img 
                            src={image} 
                            alt="Product" 
                            className="card-image"
                        />
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{productName}</h5>
                        <div className="card-content">
                            <div className="flex items-center gap-1">
                                <div className="w-[25%] flex justify-between items-center">
                                    <span style={{ fontSize: '14px' }}>Price</span>
                                    <span style={{ fontSize: '14px' }}>:</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '14px' }}>{formatNumber(price)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-[25%] flex justify-between items-center">
                                    <span style={{ fontSize: '14px' }}>Stock</span>
                                    <span style={{ fontSize: '14px' }}>:</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '14px' }}>{stock}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="absolute" style={{ top: '1%', right: '0%' }}>
                <Button 
                    text={<i className={wishList === true ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"} style={{ fontSize: '20px' }}></i>}
                    cssClass="btn"
                    onClick={() => wishList === true ? addToWishlist({ image, price, productName, stock, id, updateWishList: false, wishListId: null }) : addToWishlist({ image, price, productName, stock, id, updateWishList: true, wishListId })}
                />
            </div>
        </div>
    )
}

export default CardProduct