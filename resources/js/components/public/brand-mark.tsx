export default function BrandMark({ size = 46 }: { size?: number }) {
    return (
        <span className="pv-brand__mark" style={{ width: size, height: size }} aria-hidden="true">
            <svg
                width={size * 0.52}
                height={size * 0.52}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
            </svg>
        </span>
    );
}
