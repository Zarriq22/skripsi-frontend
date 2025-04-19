import { Link } from "react-router-dom"
import { formatNumber } from "../../plugin/helper"
import Button from "./Button"

function CardProduct ({ image, price, productName, stock, id })  {
    return (
        <div className="card">
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <span>Stock: {stock}</span>
                        <i class="fa-solid fa-info"></i>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <span>Price: {formatNumber(price)}</span>
                        <span>
                            <Link to={`/detail-product/${id}`} className="btn btn-default p-0">
                                <Button 
                                    text={<i class="fa-solid fa-cart-shopping"></i>}
                                    cssClass="bg-default p-0"
                                />
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProduct