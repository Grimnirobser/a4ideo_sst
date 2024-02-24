interface MenuItemProps {
  logo: React.ReactNode;
  label: string;
  onClick?: () => void;
  round?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  logo,
  label,
  onClick,
  round = false,
}) => {
  return (
    <div
      className={` flex items-center  p-3 cursor-pointer ${
        round && "rounded-lg"
      }`}
      onClick={onClick}
    >
      {logo}
      {label}
    </div>
  );
};

export default MenuItem;
