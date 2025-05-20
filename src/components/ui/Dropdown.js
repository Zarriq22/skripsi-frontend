import React, { Component, createRef } from 'react';
import downArrow from '../../assets/icons/down-arrow.png';
import Button from './Button';

class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            content: this.props.content
        };

        this.dropdownRef = createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.dropdownRef.current &&
            !this.dropdownRef.current.contains(event.target)
        ) {
            this.setState({ open: false });
        }
    };

    toggleDropdown = () => {
        this.setState((prevState) => ({ open: !prevState.open }));
    };

    render() {
        const { detail } = this.props;
        const { open, content } = this.state;

        return (
        <div className="relative" ref={this.dropdownRef}>
            {detail ? (
                <img
                    src={detail.avatar ? detail.avatar : downArrow}
                    alt={detail.name ? detail.name : 'Arrow'}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={this.toggleDropdown}
                />
            ) : (
                <></>
            )}

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="py-2 text-sm text-gray-700">
                        {content.map((item) => (
                            <li
                                key={item.name}
                                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                                onClick={() => this.props.onClick(item.name)}
                            >
                                <i className={`${item.icon}`}></i>
                                <Button 
                                    text={item.name}
                                    cssClass={`btn`}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        );
    }
}

export default Dropdown;