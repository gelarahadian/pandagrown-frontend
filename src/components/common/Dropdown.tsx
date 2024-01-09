
interface DropdownProps {
    open: boolean;
    trigger: React.ReactNode;
    menu: React.ReactNode[];
    onclose: () => void;
  }
  
const Dropdown: React.FC<DropdownProps> = ({ open, trigger, menu, onclose }) => {
    
    return (
        <div className="dropdown">
            {trigger}
            {open ? (
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none" >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none px-2 py-7 z-40">
                        <ul className="">
                        {menu.map((menuItem, index) => (
                            <li key={index} className="py-3 px-8 my-2 border-y border-black/10">
                            {menuItem}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-30 bg-black" onClick={onclose}></div>
                </div>
                </div>
            ) : null}
        </div>
    );
};

export default Dropdown;