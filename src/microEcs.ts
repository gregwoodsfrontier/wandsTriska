export const w: any = {
    id: 0,
    ents: [],
    comps: {},
    sys: []
}

//** Returns the id of the entity with w.id +1 */
export const addEntity = () => {
    w.ents.push(w.id)
    return w.id++
};

// e is entity, n is the name of the component, c is the component object
export const addComp = (e: number, n: string, c: {}) => (w.comps[n] ||= {})[e] = c;

export const getComp = (e: number, n: string) => w.comps[n]?.[e];
export const addSys = (c: {}, u: CallableFunction) => w.sys.push({ c, u });
export const ecsUpdate = (dt: number) => {
    w.sys.forEach((s: any) => 
        w.ents.filter((e:number) => s.c.every((n:string) => getComp(e, n)))
        .forEach((e:number) => s.u(e, dt)))
};

// const posComp = (x = 0, y = 0) => ({ x, y });
// const velComp = (vx = 0, vy = 0) => ({ vx, vy });

// addSys(['pos', 'vel'], (e, dt) => {
//   const p = getComp(e, 'pos'), v = getComp(e, 'vel');
//   p.x += v.vx * dt; p.y += v.vy * dt;
// });

// const e = addEntity();
// addComp(e, 'pos', posComp(1, 2));
// addComp(e, 'vel', velComp(0.1, 0.1));
// ecsUpdate(16);