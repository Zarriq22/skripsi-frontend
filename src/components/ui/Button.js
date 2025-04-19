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
        const { cssClass, text, onClick, disabled, style, visible = true  } = this.props

        if (!visible) return null;
        
        return (
            <button 
                className={`btn ${cssClass}`} 
                onClick={onClick ? onClick : this.onClick()}
                style={style}
                disabled={disabled}
            >
                {text}
            </button>
        );
    }
}
export default Button;