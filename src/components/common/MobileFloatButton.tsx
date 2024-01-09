import buttonIcon from 'assets/mobile/top-button.svg';

interface MobileFloatButtonProps {
  onClick?: any
}

function MobileFloatButton({ onClick }: MobileFloatButtonProps) {
  return (
    <button onClick={onClick ? onClick : () => 0} className="ml-auto my-auto rounded-5 bg-gray flex" style={{ height: '40px', width: '40px' }}>
      <img src={buttonIcon} className="m-auto" />
    </button>
  )
}

export default MobileFloatButton;