export const userType = () =>
    Object.entries({
        1: "Admin",
        2: "User"
    }).map(([value, label]) => ({
        value,
        label
}));