import React, { Component } from "react";
import DataUser from "../dataUser";

class ManageUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: {}
        }
    }

    render() {
        return (
            <div className="pb-4">
                <DataUser />
            </div>
        );
    }
}

export default ManageUser;