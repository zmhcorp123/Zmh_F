import { navigate } from "../utils/router";
import { Icon } from "./icons";

export function Button({ children, to, variant = "primary", icon = "arrow", type = "button", onClick, disabled = false }) {
  const handleClick = (event) => {
    if (disabled) return;
    if (to) {
      event.preventDefault();
      navigate(to);
    }
    onClick?.(event);
  };

  return (
    <button type={type} className={"btn " + variant} onClick={handleClick} disabled={disabled}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}
