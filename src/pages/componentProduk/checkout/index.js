import { Component } from 'react';
import { withLocation } from '../../../router/custom/withLocation'
import httpRequest from '../../../plugin/httpRequest';

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
    };
  }

  checkout = async (product) => {
    try {
      const res = await httpRequest(process.env.REACT_APP_BASE_URL, 'pesanan', 'POST', {
        values: {
          productName: product.productName, 
          productId: product._id, 
          userId: product.userId, 
          price: product.price, 
          image: product.image, 
          description: product.description, 
          status: 1
        }
      });

      if (res) {
        this.props.history.push('/pesanan-saya');
      }
    } catch (e) {
      
    }
  }

  render() {
    const { state } = this.props.location;
    const product = state?.product;
    
    if (!product) {
      return <div>Data produk tidak ditemukan!</div>;
    }

    return (
      <div>
        <h2>Checkout</h2>
        <p>Produk: {product.name}</p>
        <p>Harga: Rp {product.price.toLocaleString()}</p>
        <p>Jumlah: {product.quantity}</p>
        <img src={product.image} alt={product.name} style={{ width: 150 }} />

        <button onClick={() => this.checkout(product)}>checkout</button>
      </div>
    );
  }
}

export default withLocation(Checkout);