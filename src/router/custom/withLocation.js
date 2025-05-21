import { useLocation } from "react-router-dom";

export function withLocation(Component) {
  return function (props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}