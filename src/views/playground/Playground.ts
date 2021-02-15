import {Property} from "../../core/property-new/Property";
import {PString} from "../../core/property-new/strategy/StringStrategy";
import {ArrayProperty} from "../../core/property-new/ArrayProperty";
import {TwoWayPropertyBuilder} from "../../core/property-new/extension/two-way/TwoWayPropertyBuilder";
import {TwoWayStrategyBuilders} from "../../core/property-new/extension/two-way/TwoWayStrategyBuilders";
import {PVector, Vector, VectorStrategy} from "../../core/property-new/strategy/CustomStrategy";
import {TwoWayVectorStrategy} from "../../core/property-new/extension/two-way/TwoWayVectorStrategy";
import {MapProperty} from "../../core/property-new/MapProperty";

export class Playground {
    initialize() {
        const twoWayStrategy = new TwoWayStrategyBuilders().addDefaultBuilders();
        twoWayStrategy.builders.set(VectorStrategy, TwoWayVectorStrategy);
        const twoWayProperty = new TwoWayPropertyBuilder(twoWayStrategy);
        
        const testString = new Property(PString(), "ASD");
        const testStringTwoWay = twoWayProperty.buildFor(testString);
        document.body.appendChild(testStringTwoWay.root);

        const testStringArray = new ArrayProperty(PString(), ["I", "AM", "INEVITABLE"]);
        const testStringArrayTwoWay = twoWayProperty.buildFor(testStringArray);
        document.body.appendChild(testStringArrayTwoWay.root);

        const testVectorArray = new ArrayProperty(PVector(), [new Vector(1, 3), new Vector(3, 7)]);
        const testVectorArrayTwoWay = twoWayProperty.buildFor(testVectorArray);
        document.body.appendChild(testVectorArrayTwoWay.root);
        
        const testStringVectorMap = new MapProperty(PString(), PVector());
        testStringVectorMap.set("NO", new Vector(1, 3));
        testStringVectorMap.set("YES", new Vector(6, 9));
        const testStringVectorMapTwoWay = twoWayProperty.buildFor(testStringVectorMap);
        document.body.appendChild(testStringVectorMapTwoWay.root);
        
        setTimeout(()=> {
            testString.set(testString.get() + " NANI!");
            testStringArray.push("NANI!");
            testVectorArray.set(1, new Vector(4, 5));
            testStringVectorMap.set("MM", new Vector(0, 2));
        }, 3000);

    }

    render() {

    }

}

window.onload = () => new Playground().initialize();