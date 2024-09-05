import { Color, ParticleEmitter, PI, rgb, Sound, Vector2 } from "littlejsengine";

// sound effects
export const SE = {
    JUMP: new Sound([,,193,.04,.07,.15,,2.7,15,,,,,,,,,.9,.02]),
    SPIK_EXPLODE: new Sound([1.1,,33,.01,.11,.79,4,1.3,,-5,,,,1.9,,.6,,.49,.09]),
    TILE_EXPLODE: new Sound([,,92,.02,.01,.66,1,1.8,8.6,,,,,.5,,.9,,.3,.19,.16])
}

// using the spooky6 pallete
export const PALLETE = {
    DARK_3: rgb(5/256, 0/256, 39/256),
    DARK_2: rgb(53/256, 1/256, 75/256),
    DARK_1: rgb(124/256, 10/256, 114/256),
    RED: rgb(190/256, 29/256, 71/256),
    YELLOW: rgb(255/256, 163/256, 63/256),
    WHITE: rgb(255/256, 253/256, 203/256),
}


export const makeDeb = (pos: Vector2, color: Color, amount = 50, size=.2, elasticity = .3) => {
    const color2 = color.lerp(rgb(), .1);
    const emitter = new ParticleEmitter(
        pos, 0, 1, .1, amount/.1, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
        undefined,                      // tileInfo
        color, color2,          // colorStartA, colorStartB
        color, color2,          // colorEndA, colorEndB
        3, size,size, .1, .05,  // time, sizeStart, sizeEnd, speed, angleSpeed
        1, .95, .4, PI, 0,      // damp, angleDamp, gravity, particleCone, fade
        .5, true                   // randomness, collide, additive, colorLinear, renderOrder
    );
    emitter.elasticity = elasticity;
    return emitter;
}