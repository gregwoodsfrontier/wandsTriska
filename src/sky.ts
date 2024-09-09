import { Color, drawText, EngineObject, hsl, mainCanvas, mainContext, overlayCanvas, overlayContext, randColor, randInt, RandomGenerator, rgb, screenToWorld, time, vec2 } from "littlejsengine";
import { PALLETE } from "./effects";
import { gameData } from "./game";

export default class Sky extends EngineObject {
    constructor() 
    {
        super();

        this.renderOrder = -1e4;
        this.seed = randInt(1e9);
        this.skyColor = randColor(PALLETE.DARK_2, PALLETE.DARK_1);
        this.horizonColor = this.skyColor.subtract(hsl(0,0,.05,0)).mutate(.3);
    }

    seed
    skyColor: Color
    horizonColor: Color

    render()
    {
        // fill background with a gradient
        const gradient = mainContext.createLinearGradient(0, 0, 0, mainCanvas.height);
        gradient.addColorStop(0, this.skyColor.toString());
        gradient.addColorStop(1, this.horizonColor.toString());
        mainContext.save();
        mainContext.fillStyle = gradient;
        mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainContext.globalCompositeOperation = 'lighter';
        
        // draw stars
        const random = new RandomGenerator(this.seed);
        for (let i=1e3; i--;)
        {
            const size = random.float(.5,2)**2;
            const speed = random.float() < .9 ? random.float(5) : random.float(9,99);
            const color = hsl(random.float(-.3,.2), random.float(), random.float());
            const extraSpace = 50;
            const w = mainCanvas.width+2*extraSpace, h = mainCanvas.height+2*extraSpace;
            const screenPos = vec2(
                (random.float(w)+time*speed)%w-extraSpace,
                (random.float(h)+time*speed*random.float())%h-extraSpace);
            mainContext.fillStyle = color.toString();
            mainContext.fillRect(screenPos.x, screenPos.y, size, size);
        }
        mainContext.restore();
    }
    
}