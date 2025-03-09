

const Header = () => {
    return (
        <header className="flex justify-between items-center bg-[#1E2139]">
            <div>
                <img src="src/assets/logoapp.svg" alt="Invoice App Logo" />
            </div>
            <div className="flex items-center gap-4 mr-5">
                <img src="src/assets/Combined Shape.svg" alt="Point" />
                <img src="src/assets/Rectangle.svg" alt="Bar separator" />
                <img src="src/assets/image-avatar.jpg" alt="Profile Picture" className="w-8 h-8 rounded-full"/>
            </div>
        </header>
    );
}

export default Header;