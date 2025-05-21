import React, { Component } from "react";
import { statusPesanan } from "../../plugin/lookup";
import { formatNumber } from "../../plugin/helper";
import httpRequest from "../../plugin/httpRequest";
import ModalDelivery from "./modalDelivery";

class StatusDelivery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredData: [],
        };

        this.showModalKirimRef = React.createRef();
    }

    componentDidMount() {
        this.filterData()
    }

    filterData = async () => {
        try {
            const res = await httpRequest(process.env.REACT_APP_BASE_URL, 'pesanan', 'GET')

            if (res) {
                this.setState({
                    filteredData: res.filter(val => val.status === 1 || val.status === 2)
                })
            }
        } catch (e) {
            
        }
    };

    showModalKirim = (status) => {
        if (status !== 1) return
        this.showModalKirimRef.current.showModal(this.state.filteredData)
    }

    render() {
        const { filteredData } = this.state;

        return (
            <div className="flex flex-col gap-4">
                {filteredData.length === 0 && (
                    <div className="text-gray-500 text-center">Belum ada pesanan</div>
                )}
                {filteredData.map((item, index) => {
                    const status = statusPesanan().find(val => val.value === String(item.status));
                    return (
                        <div key={index} className="flex gap-4 border p-4 rounded shadow">
                            <img src={item.image} alt="" className="w-[100px] h-[100px] object-cover" />
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{item.productName}</span>
                                    <span className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded cursor-pointer" onClick={() => this.showModalKirim(item.status)}>
                                        {status.label === 'Sedang Dikemas' ? 'Harus Dikirim' : status.label || "Tidak diketahui"}
                                    </span>
                                </div>
                                <span className="text-gray-600">{item.description}</span>
                                <span className="text-red-600 font-semibold">Rp {formatNumber(item.price)}</span>
                            </div>
                        </div>
                    );
                })}

                <ModalDelivery 
                    ref={this.showModalKirimRef}
                />
            </div>
        );
    }
}

export default StatusDelivery;
