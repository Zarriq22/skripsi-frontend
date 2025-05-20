import { Component } from "react";
import Button from "./Button";
import { formatNumber } from "../../plugin/helper";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          ...this.props
        }
      ],
      quantity: this.props.quantity || 1,
      totalPrice: this.props.price,
      line: true
    }
  }

  incrementQuantity = () => {
    this.setState({
      quantity: this.state.quantity + 1
    })
  }

  decrementQuantity = () => {
    if (this.state.quantity === 1) return
    this.setState({
      quantity: this.state.quantity - 1
    })
  }

  handleEdit = () => {
    this.setState({
      line: !this.state.line
    })
  }

  handleSave = () => {
    const { item, onSaveEdit } = this.props;
    const { quantity } = this.state;
  
    const updatedItem = {
      ...item,
      quantity: quantity,
      totalPrice: item.products[0].price * quantity
    };
  
    // Panggil callback ke parent
    if (onSaveEdit) {
      onSaveEdit(updatedItem);
    }
  
    this.setState({ line: true });
  }

  handleDelete = () => {
    this.setState({
      line: true
    })
  }

  render() {
    const { index, item } = this.props
    const { quantity, totalPrice, line } = this.state
    return (
      <div className="cart">
        <div key={index} className="cart-item">
          {/* Kontainer isi produk */}
          <div className="cart-header">
            <div className="shop-name">Zarrion<i className="text-cyan-500">F</i></div>
            <div>
              {line && <Button 
                text="Ubah"
                onClick={this.handleEdit}
                cssClass="qty-btn"
              />}
              {!line && <Button 
                text="Selesai"
                onClick={this.handleSave}
                cssClass="qty-btn"
              />}
            </div>
          </div>
          <div className="cart-content" >
            {/* Gambar Produk */}
            <img className="cart-image" src={item.products[0].image} alt="Product" />

            {/* Detail Produk */}
            <div className="cart-details">
              <div className={`line ${line ? 'block' : 'hidden'}`}></div>
              <div className="flex justify-between items-center">
                {/* Nama Produk */}
                <div>
                  <div className="product-name" >{item.products[0].productName}</div>
                  <div className="product-variant" >Variasi: <span style={{ fontWeight: 'bold' }}>Hijau, Couple pendek</span></div>
                </div>

                {/* Harga & Kuantitas */}
                <div>
                  <span className="new-price" >Rp{formatNumber(totalPrice)}</span>
                </div>

                {/* Kuantitas */}
                <div className="qty-box" >
                  <Button 
                    text={<i className="fa fa-minus" aria-hidden="true"></i>}
                    onClick={this.decrementQuantity}
                    cssClass="qty-btn"
                  />
                  <span className="qty-input" >
                    {quantity}
                  </span>
                  <Button 
                    text={<i className="fa fa-plus" aria-hidden="true"></i>}
                    onClick={this.incrementQuantity}
                    cssClass="qty-btn"
                  />
                </div>

                {/* Total */}
                <div className="total-price">Rp{formatNumber(item.products[0].price * quantity)}</div>

                <div className={`${line ? 'hidden' : 'block'}`}>
                  <Button 
                    text="Hapus"
                    onClick={this.props.handleDelete}
                    cssClass="btn-danger"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;