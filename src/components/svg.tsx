type SVGType = {
    d: string
}

const SVG = ({d} : SVGType) => {
    return (
        <svg
            className = 'menu-logo'
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

export default SVG;