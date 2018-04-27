import { LinkModel, LinkModelListener } from "../../models/LinkModel";
import * as _ from "lodash";
import { DiagramEngine } from "../../DiagramEngine";
import { DefaultLabelModel } from "./DefaultLabelModel";
import { LabelModel } from "../../models/LabelModel";
import { BaseEvent } from "@projectstorm/react-canvas";

export interface DefaultLinkModelListener extends LinkModelListener {
	colorChanged?(event: BaseEvent<DefaultLinkModel> & { color: null | string }): void;

	widthChanged?(event: BaseEvent<DefaultLinkModel> & { width: 0 | number }): void;
}

export class DefaultLinkModel extends LinkModel<DefaultLinkModelListener> {
	protected width: number;
	protected color: string;
	protected curvyness: number;

	constructor(type: string = "default") {
		super(type);
		this.color = "rgba(255,255,255,0.5)";
		this.width = 3;
		this.curvyness = 50;
	}

	serialize() {
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(ob, engine: DiagramEngine, cache) {
		super.deSerialize(ob, engine, cache);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.width = width;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color: string) {
		this.color = color;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}

	getWidth() {
		return this.width;
	}

	getColor() {
		return this.color;
	}

	getCurvyness() {
		return this.curvyness;
	}
}
