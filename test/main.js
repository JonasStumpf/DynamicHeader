//import { DynamicHeader, Scroll, Sections, Checkpoint, Component } from "../src/index.js";

import { DynamicHeader, Scroll, Sections, Checkpoint, Component } from "../dist/DynamicHeader.esm.js"; //esm
//const {DynamicHeader, Scroll, Sections, Checkpoint, Component} = DH; //iif


class TestComponent extends Component {
    options = {
        testClass: "default-test-component-class"
    }
    init() {
        this.dh.addClass(this.options.testClass);
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
    },
    TestComponent: {
        testClass: "test-component-class"
    }
}, [
    Scroll,
    Checkpoint,
    TestComponent
]);

dh.on("section", (data)=>{
    if (data.section.classList.contains("blue")) {
        dh.getComponent("Sections").setClass("blue");
    }
});

dh.mount([Sections]);

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