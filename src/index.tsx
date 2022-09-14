import { Component, render } from "inferno";
import { Main } from "./components/Main";
import "./main.css";

const container = document.getElementById("app");

class MyComponent extends Component<unknown, unknown> {
	constructor(props: unknown, context: unknown) {
		super(props, context);
	}

	public render() {
		return (
			<div className="container">
				<Main />
			</div>
		);
	}
}

render(<MyComponent />, container);
