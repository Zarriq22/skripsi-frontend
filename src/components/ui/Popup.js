import React, { Component } from 'react';
import '../../assets/css/popup.css';
import Button from './Button';

class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            left: 100,
            top: 100
        };
        this.popupRef = React.createRef();
    }

    render() {
        const { visible, onHiding, title, height, width, children } = this.props;
        const { left, top } = this.state;

        if (!visible || left === null || top === null) return null;

        return (
            <div className="popup-overlay">
                <div
                    className="popup"
                    ref={this.popupRef}
                    style={{ height: height ? height : 'auto', width: width ? width : 'auto' }}
                    onMouseDown={this.startDrag}
                >
                    <div className='popup-content'>
                        <div className="popup-header" style={{ userSelect: 'none' }}>
                            <span>{title}</span>
                            <button className="close-btn" onClick={onHiding}>
                                <i className='fa fa-times'></i>
                            </button>
                        </div>
                        <div>
                            <div className="popup-body">{children}</div>
                        </div>
                        <div>
                            {!this.props.toolbarItems && 
                                <div className="popup-footer">
                                    <Button 
                                        text="Simpan" 
                                        onClick={onHiding}
                                        cssClass="bg-button-popup-save"
                                    />
                                    <Button 
                                        text="Tutup" 
                                        onClick={onHiding}
                                        cssClass="bg-button-popup-close"
                                    />
                                </div>
                            }
                            {this.props.toolbarItems && 
                                <div className="popup-footer">
                                    {this.props.toolbarItems.map((item, index) => (
                                        <Button 
                                            key={index}
                                            text={item.text} 
                                            onClick={item.onClick}
                                            cssClass={item.cssClass}
                                            visible={item.visible}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Popup;