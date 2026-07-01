import { navigate } from "../utils/router";
import { Icon } from "./icons";

export function Button({ children, to, variant = "primary", icon = "arrow", type = "button", onClick }) {
  const handleClick = (event) => {
    if (to) {
      event.preventDefault();
      navigate(to);
    }
    onClick?.(event);
  };

  return (
    <button type={type} className={"btn " + variant} onClick={handleClick}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}
