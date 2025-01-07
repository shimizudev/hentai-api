export class Dimension {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public getAspectRatio(): string {
        const gcd = this.gcd(this.width, this.height);
        return `${this.width / gcd}:${this.height / gcd}`;
    }

    public getWidthInPx(): number {
        return this.width;
    }

    public getHeightInPx(): number {
        return this.height;
    }

    public getWidthInRem(baseFontSize: number = 16): number {
        return this.width / baseFontSize;
    }

    public getHeightInRem(baseFontSize: number = 16): number {
        return this.height / baseFontSize;
    }

    private gcd(a: number, b: number): number {
        if (b === 0) {
            return a;
        }
        return this.gcd(b, a % b);
    }

    public static fromString(dimensionString: string): Dimension | null {
        const [width, height] = dimensionString.split('x').map(Number);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            return null;
        }
        return new Dimension(width, height);
    }
}
