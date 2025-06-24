export const userType = () =>
    Object.entries({
        1: "Admin",
        2: "User"
    }).map(([value, label]) => ({
        value,
        label
}));

export const category = () =>
    Object.entries({
        "Pakaian": "Pakaian",
        "Tas": "Tas",
        "Sepatu": "Sepatu",
        "Jam": "Jam Tangan",
        "Topi": "Topi",
        "Sarung": "Sarung",
        "Mukena": "Mukena",
        "Kerudung": "Kerudung",
        "Peci": "Peci",
        "Perhiasan": "Perhiasan",
        "Kacamata": "Kacamata",
        "Aksesoris": "Aksesoris"
    }).map(([value, label]) => ({
        value,
        label
}));

export const gender = () =>
    Object.entries({
        "Unisex": "Unisex",
        "Laki-laki": "Laki-laki",
        "Perempuan": "Perempuan"
    }).map(([value, label]) => ({
        value,
        label
}));

export const statusPesanan = () =>
    Object.entries({
        0: "Sedang Dibuat",
        1: "Sedang Dikemas",
        2: "Sedang Dikirim",
        3: "Pesanan Selesai",
        4: "Pesanan Dibatalkan"
    }).map(([value, label]) => ({
        value,
        label
}));