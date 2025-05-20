import React, { Component } from "react";
import { formatNumber } from "../../plugin/helper";

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            rowsPerPage: 5,
            sortBy: null,
            sortDirection: 'asc',
            columnFilters: {},
            loading: true,
            contextMenu: {
                visible: false,
                x: 0,
                y: 0,
                selectedRow: null
            },
        };

        this.contextMenuRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            loading: false
        });

        document.addEventListener('click', this.handleDocumentClick);  // Mengganti event listener
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick = (e) => {
        // Jika klik terjadi di luar context menu, tutup menu
        if (this.contextMenuRef.current && !this.contextMenuRef.current.contains(e.target)) {
            this.closeContextMenu();
        }
    };

    handleColumnFilterChange = (field, value) => {
        this.setState(prev => ({
            columnFilters: {
                ...prev.columnFilters,
                [field]: value
            },
            currentPage: 1
        }));
    };

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };

    handleSort = (field) => {
        const { sortBy, sortDirection } = this.state;
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        this.setState({ sortBy: field, sortDirection: newDirection });
    };

    applyColumnFilters = (data) => {
        const { columnFilters } = this.state;
        return data.filter(row => {
            return Object.entries(columnFilters).every(([field, value]) => {
                if (!value) return true;
                const cellValue = row[field] ? String(row[field]).toLowerCase() : "";
                return cellValue.includes(value.toLowerCase());
            });
        });
    };

    applySorting = (data) => {
        const { sortBy, sortDirection } = this.state;
        if (!sortBy) return data;

        return [...data].sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    };

    handleRightClick = (row, e) => {
        if (e.button === 2) {
            e.preventDefault();
            this.setState({
                contextMenu: {
                    visible: this.props.menuRightClick || false,
                    x: e.clientX,
                    y: e.clientY,
                    selectedRow: row
                }
            });
        }
    };

    closeContextMenu = () => {
        this.setState({
            contextMenu: {
                ...this.state.contextMenu,
                visible: false
            }
        });
    };

    handleRowsPerPageChange = (value) => {
        this.setState({
            rowsPerPage: value,
            currentPage: 1  // Reset to first page when changing rows per page
        });
    };

    refreshData = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1000);
    };

    render() {
        const { columns, data, height, menuRightClick, onToolbarPreparing } = this.props;
        const { currentPage, rowsPerPage, sortBy, sortDirection, loading, contextMenu } = this.state;

        const filteredData = this.applyColumnFilters(data);
        const sortedData = this.applySorting(filteredData);

        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);
        const totalPages = Math.ceil(sortedData.length / rowsPerPage);

        return (
            <div className="table-responsive">
                <div style={{ overflow: 'auto', height: height ? height : 'auto' }}>
                    <table className="table">
                        <thead style={{ position: 'sticky', top: 0 }}>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="table-th">
                                        {col.header}
                                        {col.sortable && (
                                            <span
                                                onClick={() => this.handleSort(col.field)}
                                                className="ml-1 cursor-pointer select-none"
                                            >
                                                {sortBy === col.field ? (sortDirection === 'asc' ? '🔼' : '🔽') : '↕️'}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                            <tr style={{ backgroundColor: 'lightblue' }}>
                                {columns.map((col, idx) => (
                                    <th key={idx}>
                                        {col.field && (
                                            <div className="relative">
                                                <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
                                                    <i className="fa fa-search" style={{ fontSize: '12px', color: 'gray' }}    ></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={`Cari ${col.header}`}
                                                    value={this.state.columnFilters[col.field] || ''}
                                                    onChange={(e) =>
                                                        this.handleColumnFilterChange(col.field, e.target.value)
                                                    }
                                                    className="w-full pl-4 pr-2 py-1 border rounded form-input"
                                                />
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                currentRows.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onContextMenu={(e) => this.handleRightClick(row, e)}
                                    >
                                        {columns.map((col, colIndex) => {
                                            const rawValue = row[col.field];
                                            const type = col.type;
                                            const displayValue = type === 'number' ? (rawValue ? formatNumber(rawValue) : rawValue) : col.lookup ? col.lookup[rawValue] || rawValue : rawValue;

                                            return (
                                                <td key={colIndex}>
                                                {col.render
                                                    ? col.render(row, rowIndex + indexOfFirstRow)
                                                    : displayValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {contextMenu.visible && (
                    <div
                        ref={this.contextMenuRef}
                        style={{
                            position: "fixed",
                            top: contextMenu.y,
                            left: contextMenu.x,
                            backgroundColor: "white",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            zIndex: 1000,
                            borderRadius: "4px",
                            padding: "8px 0",
                            minWidth: "120px"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {menuRightClick && (
                            <div>
                                {onToolbarPreparing.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-full text-left px-4 py-2 ${item.className || ""} hover:bg-gray-100`}
                                        onClick={() => {
                                            item.action?.(contextMenu.selectedRow);
                                            this.closeContextMenu();
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex items-center" style={{ gap: '12px' }}>
                        <div>
                            <span>Page:</span>
                            <span>{currentPage}</span>
                            <span> of </span>
                            <span>{sortedData.length}</span>
                        </div>
                        <div>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => this.handleRowsPerPageChange(parseInt(e.target.value, 10))}
                                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>
                    <div className="pagination flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 border-blue-500 text-white" : "bg-gray-100"}`}
                                onClick={() => this.handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default DataTable;