import { useNavigate, useLocation } from "react-router-dom";

export function withNavigate(Component) {
    return function (props) {
        const navigate = useNavigate();
        const location = useLocation(); // <-- Tambahkan ini
        return <Component {...props} navigate={navigate} location={location} />; // <-- Inject juga
    };
}