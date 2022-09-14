import { Component } from "inferno";
import Papa from "papaparse";
import { tokima_csv } from "../assets/tokima";
import { TextConverter } from "./TextConverter";

interface State {
	dictionary: unknown[];
}

export class Main extends Component<unknown, State> {
	constructor(props: unknown, context: unknown) {
		super(props, context);
		const dictionary = Papa.parse(tokima_csv, {
			header: false,
		}).data;
		this.state = {
			dictionary,
		};
	}

	render() {
		return (
			<>
				<nav className="nav">
					<div className="nav-center">
						<div className="brand">{"Toki Ma <-> Emoji Translator"}</div>
					</div>
				</nav>
				<br />
				<TextConverter dictionary={this.state.dictionary} />
				<nav className="nav">
					<div className="nav-right">
						<a href="https://github.com/dessalines/toki-ma-emoji-translator">
							Code / Contact
						</a>
					</div>
				</nav>
			</>
		);
	}
}
