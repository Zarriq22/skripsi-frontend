import { useNavigate } from "react-router-dom";

export function withNavigate(Component) {
    return function (props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}