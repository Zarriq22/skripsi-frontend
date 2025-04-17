import { Component } from "react";

class Button extends Component {
    constructor (props) {
        super (props)

        this.onClick = this.onClick.bind(this)
    }

    onClick = (e) => {
        console.log('Button di tekan')
    }
    render() {
        return (
            <button 
                className={`btn ${this.props.buttonType ? `${this.props.buttonType}` : 'btn-primary'} ${this.props.cssClass}`} 
                onClick={this.props.onClick ? this.props.onClick : this.onClick()}
                style={this.props.style}
                disabled={this.props.disabled}
            >
                {this.props.text}
            </button>
        );
    }
}
export default Button;