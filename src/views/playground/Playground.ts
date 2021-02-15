import {Property} from "../../core/property-new/Property";
import {PString} from "../../core/property-new/strategy/StringStrategy";
import {ArrayProperty} from "../../core/property-new/ArrayProperty";
import {TwoWayPropertyBuilder} from "../../core/property-new/extension/two-way/TwoWayPropertyBuilder";
import {TwoWayStrategyBuilders} from "../../core/property-new/extension/two-way/TwoWayStrategyBuilders";

export class Playground {
    initialize() {
        const twoWayStrategy = new TwoWayStrategyBuilders().addDefaultBuilders();
        const twoWayProperty = new TwoWayPropertyBuilder(twoWayStrategy);
        
        const testString = new Property(PString(), "ASD");
        
        const testStringArray = new ArrayProperty(PString(), ["I", "AM", "INEVITABLE"]);

        const testStringTwoWay = twoWayProperty.buildFor(testString);
        document.body.appendChild(testStringTwoWay.root);

        const testStringArrayTwoWay = twoWayProperty.buildFor(testStringArray);
        document.body.appendChild(testStringArrayTwoWay.root);
        
        setTimeout(()=> {
            testString.set(testString.get() + " NANI!");
            testStringArray.push("NANI!");
        }, 3000);

    }

    render() {

    }

}

window.onload = () => new Playground().initialize();