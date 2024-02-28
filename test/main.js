//import { DynamicHeader, Scroll, Sections, Checkpoint, Component } from "../src/index.js";

import { DynamicHeader, Scroll, Sections, Checkpoint, Component } from "../dist/DynamicHeader.esm.js"; //esm
//const {DynamicHeader, Scroll, Sections, Checkpoint, Component} = DH; //iif


class TestComponent extends Component {
    init() {
        this.dh.addClass("test-component-class");
    }
}

const dh = new DynamicHeader({
    header: document.querySelector("header"),
    //targetEvents: true,
    Checkpoint: {
        checkpoints: [
            {
                pos: "top:100vh",
                class: "top-vh"
            },
            "top"
        ]
    }
}, [
    Scroll,
    Sections,
    Checkpoint,
    TestComponent
]);


/* dh.destroy(); */

/* Checkpoint Events */
/* dh.on("checkpoint", (data)=>{
    console.log("DH: Checkpoint", data);
})
document.querySelector("header").addEventListener("dh-checkpoint", (event)=>{
    console.log("Header: Checkpoint", event);
});
setTimeout(() => {
    document.querySelector(".top-vh").addEventListener("dh-checkpoint", (event)=>{
    console.log("Checkpoint: Checkpoint", event);
});
}, 50); */


/* Scroll Events */
/* dh.on("scroll", (data)=>{
    console.log("DH: Scroll", data);
});
document.querySelector("header").addEventListener("dh-scroll", ()=>{
    console.log("Header: Scroll", event);
});
 */