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
        1: "Pakaian Pria",
        2: "Pakaian Wanita",
        3: "Tas",
        4: "Sepatu",
        5: "Jam Tangan",
        6: "Topi",
        7: "Pakaian Muslim",
        8: "Pakaian Muslimah",
        9: "Sarung",
        10: "Mukena",
        11: "Kerudung",
        12: "Peci",
    }).map(([value, label]) => ({
        value,
        label
}));