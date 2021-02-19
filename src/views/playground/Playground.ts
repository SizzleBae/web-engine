import {Property} from "../../core/property/Property";
import {PString} from "../../core/property/strategy/StringStrategy";
import {ArrayProperty} from "../../core/property/ArrayProperty";
import {TwoWayPropertyBuilder} from "../../core/property/extension/two-way/TwoWayPropertyBuilder";
import {TwoWayStrategyBuilders} from "../../core/property/extension/two-way/TwoWayStrategyBuilders";
import {PVector, Vector, VectorStrategy} from "../../core/property/strategy/CustomStrategy";
import {TwoWayVectorStrategy} from "../../core/property/extension/two-way/TwoWayVectorStrategy";
import {MapProperty} from "../../core/property/MapProperty";
import {PBoolean} from "../../core/property/strategy/BooleanStrategy";

export class Playground {
    initialize() {
        const twoWayStrategy = new TwoWayStrategyBuilders().addDefaultBuilders();
        twoWayStrategy.builders.set(VectorStrategy, TwoWayVectorStrategy);
        const twoWayProperty = new TwoWayPropertyBuilder(twoWayStrategy);
        
        const testString = new Property(PString(), "ASD");
        const testStringTwoWay = twoWayProperty.buildFor(testString);
        document.body.appendChild(testStringTwoWay.root);

        const testBoolean = new Property(PBoolean(), true);
        const testBooleanTwoWay = twoWayProperty.buildFor(testBoolean);
        document.body.appendChild(testBooleanTwoWay.root);
        
        const testStringArray = new ArrayProperty(PString(), ["I", "AM", "INEVITABLE"]);
        const testStringArrayTwoWay = twoWayProperty.buildFor(testStringArray);

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
            testBoolean.set(!testBoolean.get());
            testStringArray.push("NANI!");
            testVectorArray.set(1, new Vector(4, 5));
            testStringVectorMap.set("MM", new Vector(0, 2));
        }, 3000);

    }

    render() {

    }

}

window.onload = () => new Playground().initialize();