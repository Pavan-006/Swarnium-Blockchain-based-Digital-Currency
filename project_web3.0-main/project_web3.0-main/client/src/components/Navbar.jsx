import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const NavBarItem = ({ title, classprops, onClick }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`} onClick={onClick}>
    <Link to={title.toLowerCase().replace(' ', '-')}>{title}</Link>
  </li>
);

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    switch (item.toLowerCase()) {
      case 'market':
        navigate('/market');
        break;
      case 'exchange':
        navigate('/exchange');
        break;
      case 'currency converter':
        navigate('/currency-converter');
        break;
      case 'Implementations':
        navigate('/Implementations');

      case 'Home':
        navigate('/home');  
      default:
        break;
    }
  };

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        {/* Logo placeholder, add if needed */}
      </div>
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Implementations", "Currency Converter" ].map((item, index) => (
          <NavBarItem 
            key={item + index} 
            title={item} 
            onClick={() => handleNavClick(item)}
          />
        ))}
      </ul>
      <div className="flex relative">
        {toggleMenu
          ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(false)} />
          : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={() => setToggleMenu(true)} />
        }
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Currency Converter"].map((item, index) => (
              <NavBarItem 
                key={item + index} 
                title={item} 
                classprops="my-2 text-lg"
                onClick={() => {
                  handleNavClick(item);
                  setToggleMenu(false);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;