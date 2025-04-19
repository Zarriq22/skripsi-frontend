import { Component } from "react";

class ScrollView extends Component {
    render() {
        const { width, height } = this.props
        return (
            <div 
                className="scroll-view" 
                style={{ 
                    width: width, 
                    height: height 
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default ScrollView