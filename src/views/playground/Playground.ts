import {TwoWayProperty} from "../../core/property-new/extension/TwoWayProperty";
import {TwoWayStrategy} from "../../core/property-new/extension/TwoWayStrategy";
import {Property} from "../../core/property-new/Property";
import {PString} from "../../core/property-new/strategy/StringStrategy";
import {PNumber} from "../../core/property-new/strategy/NumberStrategy";

export class Playground {

    initialize() {
        const twoWayStrategy = new TwoWayStrategy().addDefaultBuilders();
        const twoWayProperty = new TwoWayProperty(twoWayStrategy);
        
        const testString = new Property(PString(), "");
        const testNumber = new Property(PNumber(), 124);

        const testNumberTwoWay = twoWayProperty.buildFor(testNumber);
        const testStringTwoWay = twoWayProperty.buildFor(testString);
        console.log(testNumberTwoWay, testStringTwoWay);
        if(testStringTwoWay && testNumberTwoWay) {
            document.body.appendChild(testStringTwoWay);
            document.body.appendChild(testNumberTwoWay);
        }
        
        testString.set("HAHAHAH");
        
        setTimeout(()=>testString.set(testString.get() + " NANI!"), 3000);
    }

    render() {

    }

}

window.onload = () => new Playground().initialize();