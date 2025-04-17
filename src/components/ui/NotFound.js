import { Component } from "react";

class NotFound extends Component {
    constructor(props) {
        super(props);

        this.loadData = []
    }

    render() {
        return (
            <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="error-template">
                                <h4>Oops!</h4>
                                <h6>404 Page Not Found</h6>
                                <div className="error-details">
                                    Maaf, sesuatu telah terjadi. Halaman tidak ditemukan!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound