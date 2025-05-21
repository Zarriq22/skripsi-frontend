import { Component } from "react";
import { statusPesanan } from "../../../../plugin/lookup";
import { formatNumber } from "../../../../plugin/helper";

class SemuaStatus extends Component {
    filterData = () => {
        const { data, filterStatus } = this.props;

        if (filterStatus === "Semua Status") {
            return data;
        }

        const idStatus = {
            dikemas: "1",
            dikirim: "2",
            selesai: "3",
            dibatalkan: "4",
        }[filterStatus];

        return data.filter(item => String(item.status) === idStatus);
    };

    render() {
        const filteredData = this.filterData();

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
                                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        {status?.label || "Tidak diketahui"}
                                    </span>
                                </div>
                                <span className="text-gray-600">{item.description}</span>
                                <span className="text-red-600 font-semibold">Rp {formatNumber(item.price)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default SemuaStatus;
