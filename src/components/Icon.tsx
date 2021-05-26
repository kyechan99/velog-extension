type IconType = {
    d: string
}

const Icon = ({d} : IconType) => {
    return (
        <svg
            className = 'icon'
            xmlns = 'http://www.w3.org/2000/svg'
            width = '16'
            height = '16'
            viewBox = '0 0 16 16'
            stroke = 'currentColor'
        >
            <path
                d={d}
            />
        </svg>
    );
};

export default Icon;