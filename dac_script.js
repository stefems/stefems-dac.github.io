
const COLORS = [
    "#48617F",
    "#5329F4",
    "#8E8E8E",
    "#95B8D1",
    "#9C84F5",
    "#C0FE04",
    "#F24723",
    "#F8ED34",
    "#FF15BE",
    "#1C1C1C",
    "#000000"
];

const CORNER_SHAPES = [
    "square_inset",
    "circle_inset",
    "four_circles_small",
    "large_square",
    "small_square",
    "clove",
    "cross",
    "dash"
];

const BACKGROUND_SHAPES = [
    "divot_square",
    "water_prop",
    "droplets",
    "air_prop",
    "four_corners",
    "cross_bg",
    "four_squares",
    "four_circles"
];

const INNER_BACKGROUND_SHAPES = [
    "circle",
    "square",
    "hexagon"
];

const CENTER_SHAPE = [
    "square",
    "cross",
    "plus"
];


const get_color = (colors_omit) => {
    let options = COLORS;
    if (colors_omit) {
        options = COLORS.filter((color) => {
            let pass_filter = true;
            for (let i = 0; i < colors_omit.length; i++) {
                if (color === colors_omit[i]) {
                    pass_filter = false;
                    break;
                }
            }
            return pass_filter;
        });
    }
    const choice = Math.floor(Math.random() * options.length);
    return options[choice];
}

const get_shape = (option) => {
    const lists = {
        "corner": CORNER_SHAPES,
        "background": BACKGROUND_SHAPES,
        "inner_background": INNER_BACKGROUND_SHAPES,
        "center": CENTER_SHAPE
    };
    const options = lists[option];
    const choice = Math.floor(Math.random() * options.length);
    return options[choice];
}

const get_coin_flip = () => {
    return Math.random() > .5;
}

    /*
    A: outer corners
    B: background
    C: inner corners
    D: circle/square/hexagon
    E: inner-2 corners
    F: inner-2 background
    G: circle/square
    H: cross/plus/square

    A != B
    B != C
    B != D
    C != D
    D != E

    F != G
    G != H

    */

const fix_colors = (dac) => {
    if (dac.A.color === dac.B.color) {
        dac.A.color = get_color([dac.B.color]);
        return (fix_colors(dac));
    }
    if (dac.B.color === dac.C.color) {
        dac.C.color = get_color([dac.B.color]);
        return (fix_colors(dac));
    }
    if (dac.B.color === dac.D.color) {
        dac.D.color = get_color([dac.B.color, dac.E.color, dac.C.color]);
        return (fix_colors(dac));
    }
    if (dac.C.color === dac.D.color) {
        dac.D.color = get_color([dac.C.color, dac.E.color]);
        return (fix_colors(dac));
    }
    if (dac.F.color === dac.G.color) {
        dac.G.color = get_color([dac.F.color, dac.H.color]);
        return (fix_colors(dac));
    }
    return dac;
}

// const printDiv = (div) => {
//     html2canvas(div).then((canvas) => {
//         document.body.appendChild(canvas);
//     });
// };

const init = () => {
    const svg_elements = {
        "cross":  document.getElementById("cross"),
        "plus": document.getElementById("plus"),
        "square": document.getElementById("square"),
        "four_circles": document.getElementById("four_circles"),
        "droplets": document.getElementById("droplets"),
        "four_squares": document.getElementById("four_squares"),
        "four_corners": document.getElementById("four_corners"),
        "water_prop": document.getElementById("water_prop"),
        "air_prop": document.getElementById("air_prop"),
        "cross_bg": document.getElementById("cross_bg"),
        "divot_square": document.getElementById("divot_square"),
        "hexagon": document.getElementById("hexagon"),
        "four_circles_small": document.getElementById("four_circles_small"),
        "circle_inset": document.getElementById("circle_inset"),
        "square_inset": document.getElementById("square_inset"),
        "clove": document.getElementById("clove"),
    };
    const create_shape = ({ shape, color, color_secondary }, colorOverride) => {
        if (!svg_elements[shape]) {
            const element = document.createElement("div");
            switch (shape) {
                case "large_square":
                    element.style.width = "48px";
                    element.style.height = "48px";
                    element.style.borderRadius = "6px";
                    element.style.backgroundColor = colorOverride ? colorOverride : color;
                    break;
                case "small_square":
                    element.style.width = "26px";
                    element.style.height = "26px";
                    element.style.borderRadius = "6px";
                    element.style.backgroundColor = colorOverride ? colorOverride : color;
                    break;
                case "dash":
                    element.style.width = "48px";
                    element.style.height = "6px";
                    element.style.borderRadius = "12px";
                    element.style.backgroundColor = colorOverride ? colorOverride : color;
                    break;
            }
            return element;
        } else {
            const clone = svg_elements[shape].cloneNode(true);
            if (shape.indexOf("inset") !== -1) {
                [...clone.children][0].setAttribute("fill", colorOverride ? colorOverride : color);
                [...clone.children][1].setAttribute("fill", color_secondary);
            } else {
                [...clone.children].forEach((child) => child.setAttribute("fill", colorOverride ? colorOverride : color));
            }
            return clone;
        }
    }
    /*
    A: outer corners
    B: background
    C: inner corners
    D: circle/square/hexagon
    E: inner-2 corners
    F: inner-2 background
    G: circle/square
    H: cross/plus/square

    A != B
    B != C
    C != D
    E != E
    F != G
    G != H

    */

    let dac_structure = {
        "A": {
            color: get_color(),
            shape: get_shape('corner'),
            color_secondary: get_color(),
            rotated: get_coin_flip(),
            corners: get_coin_flip()
        },
        "B": {
            color: get_color(),
            shape: get_shape('background'),
        },
        "C": {
            color: get_color(),
            shape: get_shape('corner'),
            color_secondary: get_color(),
            rotated: get_coin_flip(),
            corners: get_coin_flip()
        },
        "D": {
            color: get_color(),
            shape: get_shape('inner_background'),
        },
        "E": {
            color: get_color(),
            shape: get_shape('corner'),
            color_secondary: get_color(),
            rotated: get_coin_flip(),
            corners: get_coin_flip()
        },
        "F": {
            color: get_color(),
            shape: get_shape('background'),
        },
        "G": {
            color: get_color(),
            shape: Math.random() > .5 ? "circle" : "square",
        },
        "H": {
            color: get_color(),
            shape: get_shape("center")
        }
    };
    dac_structure = fix_colors(dac_structure);
    console.log(dac_structure);
    console.log(dac_structure.A.rotated);
    // OUTER: A
    const outer = document.getElementsByClassName("outer")[0];
    !dac_structure.A.corners && outer.classList.add("poles");
    const a_containers = [...document.getElementsByClassName("a_container")];
    a_containers.forEach((element) => {
        const a_shape = create_shape(dac_structure.A);
        if (dac_structure.A.rotated) a_shape.style.transform = "rotate(45deg)";
        [...element.children][0].replaceWith(a_shape);
    });


    const b =  document.getElementsByClassName("b")[0];
    const b_shape = create_shape(dac_structure.B);
    b_shape.style.height = "100%";
    b_shape.style.width = "100%";
    b.appendChild(b_shape);

    const inner = document.getElementsByClassName("c_box")[0];
    !dac_structure.C.corners && inner.classList.add("poles");
    const c_containers = [...document.getElementsByClassName("c_container")];
    c_containers.forEach((element) => {
        const c_shape = create_shape(dac_structure.C);
        c_shape.style.transform = "scale(.5)";
        if (dac_structure.C.rotated) c_shape.style.transform = "scale(.5) rotate(45deg)";
        [...element.children][0].replaceWith(c_shape);
    });

    const d = document.getElementsByClassName("d")[0];
    switch (dac_structure.D.shape) {
        case "circle":
            d.style.borderRadius = "100%";
            d.style.backgroundColor = dac_structure.D.color;
            break;
        case "square":
            d.style.borderRadius = "6px";
            d.style.backgroundColor = dac_structure.D.color;
            break;
        case "hexagon":
            const d_shape = create_shape(dac_structure.D);
            d_shape.style.height = "100%";
            d_shape.style.width = "100%";
            d.appendChild(d_shape);
            break;
    }
    

    const inner_e = document.getElementsByClassName("e_box")[0];
    !dac_structure.E.corners && inner_e.classList.add("poles");
    const e_containers = [...document.getElementsByClassName("e_container")];
    e_containers.forEach((element) => {
        const e_shape = create_shape(dac_structure.E);
        e_shape.style.transform = "scale(.3)";
        if (dac_structure.E.rotated) e_shape.style.transform = "scale(.3) rotate(45deg)";
        [...element.children][0].replaceWith(e_shape);
    });

    const f =  document.getElementsByClassName("f")[0];
    const f_shape = create_shape(dac_structure.F);
    f_shape.style.height = "100%";
    f_shape.style.width = "100%";
    f.appendChild(f_shape);

    const g = document.getElementsByClassName("g")[0];
    g.style.borderRadius = dac_structure.G.shape === "square" ? "6px" : "100%";
    g.style.backgroundColor = dac_structure.G.color;
    
    const h = document.getElementsByClassName("h")[0];
    const center_shape = create_shape(dac_structure.H);
    center_shape.style.height = "100%";
    center_shape.style.width = "100%";
    h.appendChild(center_shape);

    printDiv(document.getElementById("container"));
};

document.addEventListener("DOMContentLoaded", () => {
    init();  
});