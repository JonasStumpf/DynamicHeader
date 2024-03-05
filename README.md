# DynamicHeader <!-- omit in toc -->
Change header based on scroll, sections and checkpoints.

- [Get Started](#get-started)
- [DynamicHeader](#dynamicheader)
	- [Options](#options)
	- [Event](#event)
- [Events](#events)
- [Components](#components)
	- [Scroll](#scroll)
		- [Options](#options-1)
		- [Event](#event-1)
	- [Checkpoint](#checkpoint)
		- [Options](#options-2)
		- [Event](#event-2)
	- [Sections](#sections)
		- [Options](#options-3)
		- [Event](#event-3)
- [Create your own components](#create-your-own-components)
	- [Example](#example)


## Get Started

You can download the file and use the script from the `dist` folder or include the files from CDN.

```
https://cdn.jsdelivr.net/gh/JonasStumpf/DynamicHeader@main/dist/DynamicHeader.esm.js
```
```
https://cdn.jsdelivr.net/gh/JonasStumpf/DynamicHeader@main/dist/DynamicHeader.iife.js
```

Import DynamicHeader and the components you need.

### ESM <!-- omit in toc -->
```
import { DynamicHeader, Scroll, Sections, Checkpoint, Component } from "path/to/DynamicHeader.esm.js";
```

### IIFE <!-- omit in toc -->
```
<script src="/dist/DynamicHeader.iife.js"></script>
<script>
    const {DynamicHeader, Scroll, Sections, Checkpoint, Component} = DH;
</script>
```

Initialize DynamicHeader with options and components  
`DynamicHeader(options, components)`

Example:
```
const dh = new DynamicHeader({
    header: document.querySelector("header"),
    //header: "header",
    Checkpoint: {
        checkpoints: ["top"]
    }
}, [Scroll, Checkpoint]);
```

## DynamicHeader

DynamicHeader provides the base functionalities and is extended by components.  
[Components included](#components)  
[Create your own components](#create-your-own-components)

### Options
| option | parameter | default | explanation |
| --- | --- | --- | --- |
| header | string / element | "header" | header element or selector string |
| targetEvents | boolean | false | additionally dispatch events on elements (header, checkpoints, ...) |
| prefix | string | "dh" | prefix used for various things like datasets or ids |
| resizeDelay | number | 500 | time between header resize triggers in ms |

### Event

`resize`
> event data:
> - header element
> 
> triggered on header resize (if `detectResize()` was executed)




## Events
Add event callbacks to DH:
```
dh.on("event", (data)=>{console.log(data)});
```
Add EventListeners on elements (enable [`targetEvents`](#options) and add the `prefix`):
```
document.querySelector("header").addEventListener("dh-event", (event)=>{console.log(event)});
```


## Components

Add components on DH instantiation with the second parameter:
```
new DynamicHeader(options, [Component1, Component2, ...])
```
or later with the `mount()` method:
```
dh.mount([Component1, Component2, ...]);
```

#### Options <!-- omit in toc -->

Add Component options in the DH options with the Components name as the key:
```
new DynamicHeader({
    header: "#header",
    Scroll: {
        delay: 50,
        classUp: "show",
        classDown: "hide",
    }
}, [Scroll]);
```

### Scroll

Sets classes based on the scroll direction.  
Modes for the scroll observer to trigger:
- start: start of scrolling
- mid: between start and end
- end: end of scrolling
- scroll: always

#### Options

| option | parameter | default | explanation |
| --- | --- | --- | --- |
| root | element/window | window | scrolling element |
| delay | time | 250 | scroll event throttle |
| classUp | string | "scroll-up" | class set when scrolling up |
| classDown | string | "scroll-down" | class set when scrolling down |
| modes | Array[string] | ["scroll"] | scroll modes to observe |


#### Event

`scroll`
> event data:
> - position: scroll y position
> - direction: -1 (up) / 1 (down)
> - state: start, mid, end
>
> triggered on scroll


### Checkpoint

Sets classes based on specified checkpoints in viewport.

#### Options

| option | parameter | default | explanation |
| --- | --- | --- | --- |
| obsRoot | element | null | intersection observer root |
| obsMargin | string (css format) | "0px" | observer margin |
| obsThreshold | number | 0 | observer threshold |
| checkpoints | Array[object/string] | [] | checkpoints to create/observe |
| cpClass | string | "checkpoint" | class set on checkpoints |
| dataName | string | "checkpoint" | dataset name on checkpoints |

option `checkpoint`:
> when defining checkpoints you can set 3 parameters:
> - pos: string in css format that positions the checkpoint
> - class: class set on header when checkpoint is in viewport
> - id: id on the checkpoint element
>
> there are 3 presets:
> ```
>top: {
>    pos: "top:20px",
>    class: "dh-top",
>    id: "dh-checkpoint-top"
>},
>bot: {
>    pos: "bottom:20px",
>    class: "dh-bot",
>    id: "dh-checkpoint-bot"
>},
>mid: {
>    pos: "top:50%",
>    class: "dh-mid",
>    id: "dh-checkpoint-mid"
>}
>```
> presets can be used by passing the preset name as a string in the checkpoints array

#### Event

`checkpoint`
> event data:
> - checkpoint: checkpoint element
> - intersecting: boolean, is checkpoint in viewport
> - class: checkpoint class to set on header
>
> triggered on checkpoint enter/leave


### Sections

Sets classes based on section header is above => based on background.

#### Options
| option | parameter | default | explanation |
| --- | --- | --- | --- |
| sections | string/elements | "section" | sections to observe |
| obsRoot | element | null | intersection observer root |
| dataName | string | "section" | dataset name on sections that specify class to set |

#### Event
`section`
> event data:
> - section: section changed to
> - removed: class that was removed
>
> triggered on section change


## Create your own components

When DH mounts Components it first calls `mount()`, this sets the options and the dh instance. You generally don't want to override this method.

After that it calls `init()`, override this method to do setup stuff for your component.

When `destroy()` is called on DH it calls `destroy()` on every component, override this method if you want/need to remove stuff setup by your component.  
Classes added with `DH.addClass()` are automatically removed by DH when destroyed.

> DH manages components by their classnames, it uses the property `#name` and the method `getName()`.  
> Don't override these.

### Example
Import `Component`: 
```
import { DynamicHeader, Component } from "path/to/DynamicHeader.esm.js"; //esm
const { DynamicHeader, Component } = DH; //iife
```

Create a class for your Component and extend it to `Component`:
```
class TestComponent extends Component {
    options = {
        testClass: "default-test-component-class"
    }
    init() {
        this.dh.addClass(this.options.testClass);
    }
}
```

Add it to DH:
```
const dh = new DynamicHeader({
    TestComponent: {
        testClass: "test-component-class"
    }
}, [TestComponent]);
```